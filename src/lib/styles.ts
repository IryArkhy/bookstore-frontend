export type ImageSizeProperties = {
  height: number;
  width: number;
};
export const getAdjustedImageSize = (
  original: ImageSizeProperties,
  chosen: { property: 'height' | 'width'; value: number },
): ImageSizeProperties => {
  if (chosen.property === 'width') {
    const adjustedHeight = (chosen.value * original.height) / original.width;
    return {
      height: adjustedHeight,
      width: chosen.value,
    };
  } else {
    const adjustedWidth = (chosen.value * original.width) / original.height;
    return {
      height: chosen.value,
      width: adjustedWidth,
    };
  }
};
