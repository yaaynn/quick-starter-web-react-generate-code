export const HttpUrls = {
  auth: {
    signIn: "/api/generate/auth/sign-in",
  },
  user: {
    list: "/api/user/list",
    getById: "/api/user/get-by-id",
  },
  database: {
    names: "/api/generate/database/names",
    tables: "/api/generate/database/tables",
    columns: "/api/generate/database/columns",
  },
  template: {
    getTemplateGroupNames: "/api/generate/template/get-template-group-names",
    getTemplateNames: "/api/generate/template/get-template-names",
    getTemplateConfig: "/api/generate/template/get-template-config",
    saveTemplateConfig: "/api/generate/template/save-template-config",
    getTemplateContent: "/api/generate/template/get-template-content",
  },
  generateCode: {
    writeCode2File: "/api/generate/generate-code/write-code-2-file",
  },
};
