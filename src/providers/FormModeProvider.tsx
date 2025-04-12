import { createContext, ReactNode, useContext } from "react";

export type ModeType = "create" | "edit" | "view";

export interface FormMode {
  mode: ModeType;
}
const FormModeContext = createContext<FormMode | undefined>(void 0);

export interface FormModeProviderProps {
  children?: ReactNode;
  mode: ModeType;
}
export const FormModeProvider = ({ children, mode }: FormModeProviderProps) => {
  return (
    <>
      <FormModeContext.Provider value={{ mode }}>
        {children}
      </FormModeContext.Provider>
    </>
  );
};

export const useFormMode = (): FormMode => {
  const context = useContext<FormMode | undefined>(FormModeContext);
  if (context === undefined) {
    throw new Error("useFormMode must be used within a FormModeProvider");
  }
  return context;
};
