class TinyMask {
  constructor(
    pattern: string | null,
    options?: {
      translation?: Record<string, string>;
      invalidValues?: string[];
    },
  );

  mask(value: string): string;
}

export default TinyMask;
