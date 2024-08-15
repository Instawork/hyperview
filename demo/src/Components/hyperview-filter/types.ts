type FormDataValue = string | { name?: string | undefined; type?: string | undefined; uri: string };

export type FormDataPart = {
  fieldName: string;
  string: string;
};

export declare class FormData {
  getParts(): Array<FormDataPart>;
}
