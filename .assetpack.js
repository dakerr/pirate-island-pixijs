import { compressJpg, compressPng } from '@assetpack/plugin-compress';
import { pixiManifest } from '@assetpack/plugin-manifest';

export default {
    entry: './raw-assets',
    output: './public/',
    plugins: {
        compressJpg: compressJpg(),
        compressPng: compressPng(),
        manifest: pixiManifest({
            output: './src/manifest.json',
        }),
    },
};