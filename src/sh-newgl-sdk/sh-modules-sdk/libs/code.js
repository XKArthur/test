export const init_vertex_shader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

export const matte_keyer_fragment_shader = `
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D rawGreenScreen;
uniform float texWidth;
uniform float texHeight;
uniform vec3 keyColor;
uniform float kernalSize;
uniform vec2 viewSize;
uniform int NumSamples;
uniform vec2 AlphaThresOffset;
uniform vec2 ClipBW;
uniform float hairZone;
uniform float cropX;
    
varying vec2 vUv;

const float epsilon 		= 0.001;
const vec2 WeightsRB 		= vec2( 0.5, 0.5 );

float ColorDiffKeyer( vec3 GreenScreen ) {

  float diffGR = max( keyColor.g - keyColor.r, epsilon );
  float diffGB = max( keyColor.g - keyColor.b, epsilon );
  float diff = min( diffGR, diffGB );

  float weightedRB = GreenScreen.g - ( GreenScreen.r * WeightsRB.x + GreenScreen.b * WeightsRB.y );
  float alpha = weightedRB / diff;

  float A1 = AlphaThresOffset.x;
  float A2 = AlphaThresOffset.y;

  // float hairLine = hairZone + 0.1;
  // float hairLine_upper = hairLine - 0.1;
  // float hairLine_lower = hairLine + 0.1;

  // if( vUv.x < hairLine_lower && vUv.x > hairLine_upper ) 
  // {
  // 	// A1 = 1.20;
  // 	// A2 = 0.0;
  // 	A1 = 0.56 + 6.4 * abs( vUv.x - hairLine );
  // 	A2 = abs( hairLine - vUv.x ) * 4.8;
  // }

  // alpha /= AlphaThresOffset.x;
  alpha /= A1;
  alpha = ( alpha - ClipBW.x ) / ( ClipBW.y + 0.3 - ClipBW.x );
  alpha = clamp( ( alpha - A2 ) / ( 1.0 - A2 ), 0.0, 1.0 );
  alpha = 1.0 - alpha;

  return alpha;

}


void main( void ) {

  vec4 rawPlate = texture2D( rawGreenScreen, vUv );

  float matteAlpha = ColorDiffKeyer( rawPlate.rgb );

  gl_FragColor = vec4( matteAlpha );

}
`;

export const composite_fragment_shader = `
#ifdef GL_ES
precision mediump float;
#endif

uniform bool bComp;
uniform sampler2D rawGreenScreen;
uniform sampler2D matte;
uniform float cropX;
    
varying vec2 vUv;

float judgeG ( float g, float avg ) {

  if( g > avg ) {

    return avg;

  }
  else if( g <= avg ) {

    return g;

  }

}


void main( void ) {

  vec4 rawPlate = texture2D( rawGreenScreen, vUv );
  vec4 mattePlate = texture2D( matte, vUv );

  float matteAlpha = mattePlate.a;

  vec3 matteColor = rawPlate.rgb * matteAlpha;


  float avgRB = ( matteColor.r + matteColor.b ) / 2.0;
  float g = judgeG( matteColor.g, avgRB );

  vec3 finalColor = vec3( matteColor.r, g ,matteColor.b );

  // if( vUv.x <= cropX ) {
  // 	matteAlpha = 0.0;
  // }

  if( bComp ) {
    gl_FragColor = vec4( finalColor.rgb, matteAlpha );
  }else{
    gl_FragColor = mattePlate; // rawPlate
  }
}
`;

export const roleshadow_fragment_shader = `
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D matte;
    uniform vec2 iResolution;
    
varying vec2 vUv;

    const int blur_size = 12;
const float blur_width = 2.;

const int samples = 35,
LOD = 2,         // gaussian done on MIPmap at scale LOD
sLOD = 1 << LOD; // tile size = 2^LOD
const float sigma = float(samples) * .25;

float gauss(float x, float e)
{
    return exp(-pow(x, 2.)/e); 
}

void main( void ) {

  vec4 mattePlate = texture2D( matte, vUv );

  vec4 pixval = vec4(0.);
  float tot = 0.;
  const int nb = 2 * blur_size + 1;

  for ( int x=0; x<nb; x++ )
  { 
      float x2 = blur_width*float(x-blur_size);
      vec2 ipos = vUv + vec2( x2 / iResolution.x, x2 / iResolution.y );
      float g = gauss(x2, float(20*blur_size)*(0.5+sin(2.)*0.5));
      pixval += g * texture2D( matte, ipos );;
      tot += g;
  }

  vec4 blurredColor = pixval/tot;

  float falloff = 1.0 - vUv.x;

  gl_FragColor = vec4( 0.0, 0.0, 0.0, falloff * blurredColor.a / 3. );

}
`;



export const chromaKey_fragment_shader = `
      #ifdef GL_ES
      precision mediump float;
      #endif

      uniform bool bComp;
      uniform sampler2D rawGreenScreen;
      uniform sampler2D texSeparating;
      uniform float texWidth;
      uniform float texHeight;
      uniform vec3 keyColor;
      uniform float kernalSize;
      uniform vec2 viewSize;
      uniform int NumSamples;
      uniform vec2 AlphaThresOffset;
      uniform vec2 ClipBW;
      uniform float hairZone;
          
      varying vec2 vUv;

      const float epsilon     = 0.001;
      const vec2 WeightsRB    = vec2( 0.5, 0.5 );

      #define TWO_PI  6.28318530718
      #define PI    3.14159265358


      vec4 CosineSampleHemisphere( vec2 E )
      {
        float Phi = TWO_PI * E.x;
        float CosTheta = sqrt( E.y );
        float SinTheta = sqrt( 1.0 - CosTheta * CosTheta );

        vec3 H;
        H.x = SinTheta * cos( Phi );
        H.y = SinTheta * sin( Phi );
        H.z = CosTheta;

        float PDF = CosTheta * (1.0 /  PI);

        return vec4( H, PDF );
      }


      vec2 Hammersley( int i, int numSamples )
      {   
          uint b = uint(i);
          
          b = (b << 16u) | (b >> 16u);
          b = ((b & 0x55555555u) << 1u) | ((b & 0xAAAAAAAAu) >> 1u);
          b = ((b & 0x33333333u) << 2u) | ((b & 0xCCCCCCCCu) >> 2u);
          b = ((b & 0x0F0F0F0Fu) << 4u) | ((b & 0xF0F0F0F0u) >> 4u);
          b = ((b & 0x00FF00FFu) << 8u) | ((b & 0xFF00FF00u) >> 8u);
          
          float radicalInverseVDC = float(b) * 2.3283064365386963e-10;
          
          return vec2((i / numSamples), radicalInverseVDC);
      } 


      vec3 Blur( sampler2D plate, vec2 texCoord ) 
      {

        vec2 blurRadius = kernalSize / viewSize;

        vec3 finalColor = vec3( 0.0, 0.0, 0.0 );

        int i = 0;

        int numSamples = NumSamples;

        while( i < numSamples ) 
        { 

          vec2 h = Hammersley( i, numSamples );

          vec2 pdf = CosineSampleHemisphere( h ).xy;

          vec2 uvOffset = pdf * 0.01;

          vec2 uvShifted = texCoord + uvOffset;

          vec3 hitColor = texture2D( plate, uvShifted ).rgb;

          finalColor += hitColor;

          i++;

        }

        finalColor = finalColor / float( numSamples );

        return finalColor;
      }


      float ColorDiffKeyer( vec3 GreenScreen ) {

        float diffGR = max( keyColor.g - keyColor.r, epsilon );
        float diffGB = max( keyColor.g - keyColor.b, epsilon );
        float diff = min( diffGR, diffGB );

        float weightedRB = GreenScreen.g - ( GreenScreen.r * WeightsRB.x + GreenScreen.b * WeightsRB.y );
        float alpha = weightedRB / diff;

        float A1 = AlphaThresOffset.x;
        float A2 = AlphaThresOffset.y;

        float hairLine = hairZone + 0.1;
        float hairLine_upper = hairLine - 0.1;
        float hairLine_lower = hairLine + 0.1;

        if( vUv.x < hairLine_lower && vUv.x > hairLine_upper ) 
        {
          // A1 = 1.20;
          // A2 = 0.0;
          // A1 = 0.87 + 3.3 * abs( vUv.x - hairLine );
          // A2 = abs( hairLine - vUv.x ) * 5.4;
        }

        // alpha /= AlphaThresOffset.x;
        alpha /= A1;
        alpha = ( alpha - ClipBW.x ) / ( ClipBW.y + 0.3 - ClipBW.x );
        alpha = clamp( ( alpha - A2 ) / ( 1.0 - A2 ), 0.0, 1.0 );
        alpha = 1.0 - alpha;
        // vec3 rgb = GreenScreen + 0.0 * ( GreenScreen * alpha - GreenScreen );
        // vec3 rgb = GreenScreen * alpha;

        return alpha;

      }


      float judgeG ( float g, float avg ) {

        if( g > avg ) {

          return avg;

        }
        else if( g <= avg ) {

          return g;

        }

      }


      void main( void ) {

        vec2 texCoord = vUv;

        vec4 rawPlate = texture2D( rawGreenScreen, texCoord );
        vec4 separatePlate = texture2D( texSeparating, texCoord );

        float matteAlpha = ColorDiffKeyer( rawPlate.rgb );
        float matteAlpha_sp = matteAlpha + separatePlate.a;


        vec3 matteColor = rawPlate.rgb * matteAlpha;

        vec3 finalColor;


        if( matteAlpha_sp > 0.3 ) {

          finalColor = rawPlate.rgb;

        }else{


        }


        // 下面是用来处理溢色
        float avgRB = ( matteColor.r + matteColor.b ) / 2.0;
        float g = judgeG( matteColor.g, avgRB );
        finalColor = vec3( matteColor.r, g ,matteColor.b );

        // finalColor += vec3( 0.06, 0.04, 0.0 );

        // 下面这段是演示安全区域用的
        // if( vUv.x >= 0.8 ) {
        //  finalColor = rawPlate.rgb;
        //  matteAlpha = 1.0;
        // }

        // if( vUv.x >= 0.6 && vUv.y <=0.67 && vUv.y >= 0.33 ) {
        //  finalColor = rawPlate.rgb;
        //  matteAlpha = 1.0;
        // }


        if( bComp ) {
          gl_FragColor = vec4( finalColor.rgb, matteAlpha );
        }else{
          gl_FragColor = rawPlate;
        }

        // gl_FragColor = vec4( matteAlpha );
        // gl_FragColor = vec4( texCoord, 0.0, 1.0 );

      }
`;