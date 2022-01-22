#version 110

uniform sampler2DRect background_sampler;
uniform sampler2DRect shadow_sampler;

uniform int corner_number;
uniform vec2 sampler_size;

varying vec2 texcoord0;

void main()
{
    vec2 ShadowHorCoord;
    vec2 ShadowVerCoord;
    vec2 Shadow0;

    if (corner_number == 0) {
        ShadowHorCoord = vec2(texcoord0.x, sampler_size.y);
        ShadowVerCoord = vec2(0.0, sampler_size.y - texcoord0.y);
        Shadow0 = vec2(0.0, sampler_size.y);
    } else if (corner_number == 1) {
        ShadowHorCoord = vec2(texcoord0.x, sampler_size.y);
        ShadowVerCoord = vec2(sampler_size.x, sampler_size.y - texcoord0.y);
        Shadow0 = vec2(sampler_size.x, sampler_size.y);
    } else if (corner_number == 2) {
        ShadowHorCoord = vec2(texcoord0.x, 0.0);
        ShadowVerCoord = vec2(sampler_size.x, sampler_size.y - texcoord0.y);
        Shadow0 = vec2(sampler_size.x, 0.0);
    } else if (corner_number == 3) {
        ShadowHorCoord = vec2(texcoord0.x, 0.0);
        ShadowVerCoord = vec2(0.0, sampler_size.y - texcoord0.y);
        Shadow0 = vec2(0.0, 0.0);
    }
    
    vec2 FragTexCoord = vec2(texcoord0.x, sampler_size.y - texcoord0.y);
    
    vec4 tex = texture2DRect(background_sampler, FragTexCoord);

    vec4 tex0 = texture2DRect(background_sampler, Shadow0);
    vec4 texShadow0 = texture2DRect(shadow_sampler, Shadow0);

    vec4 texHorCur = texture2DRect(background_sampler, ShadowHorCoord);
    vec4 texVerCur = texture2DRect(background_sampler, ShadowVerCoord);
    vec4 texShadowHorCur = texture2DRect(shadow_sampler, ShadowHorCoord);
    vec4 texShadowVerCur = texture2DRect(shadow_sampler, ShadowVerCoord);

    vec3 diffHorCur = (texHorCur.rgb-texShadowHorCur.rgb)*(tex.rgb/texHorCur.rgb);
    vec3 diffVerCur = (texVerCur.rgb-texShadowVerCur.rgb)*(tex.rgb/texVerCur.rgb);

    vec3 diff0 = (tex0.rgb - texShadow0.rgb)*(tex.rgb/tex0.rgb);

    vec3 diff = diffHorCur + (diffVerCur-diff0);

    gl_FragColor = vec4(diff.rgb, 1.0);
}
