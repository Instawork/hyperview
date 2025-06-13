// This type exists for casting since our current version of Flow
// does not support optional static properties. Otherwise this would
// be added as an optional property in HvComponentStatics
export type HvFormValues = {
  getFormInputValues: (element: Element) => Array<[string, string]>;
};
