if (!process.env.NEXT_PUBLIC_DEFAULT_OG_IMAGE) {
  throw new Error('NEXT_PUBLIC_DEFAULT_OG_IMAGE is not defined in the environment');
}

export const DEFAULT_OG_IMAGE_URL = process.env.NEXT_PUBLIC_DEFAULT_OG_IMAGE as string;
export const DEFAULT_DESCRIPTION = process.env.NEXT_PUBLIC_GLOBAL_DESCRIPTION as string;
export const GLOBAL_TITLE = process.env.NEXT_PUBLIC_GLOBAL_TITLE as string;
