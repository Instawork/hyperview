// @ts-ignore TS2300: Duplicate identifier 'FormData'.
class FormData {
  append: (key: string, value: string) => void = () => {};
}

global.FormData = FormData;
