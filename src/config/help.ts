export default {
  usageInstructions: `
  -------------------------------- [Usage] --------------------------------
  
  Format:
  convert <origin url> <destination output> --<flag> <value>
  
  Example default options:
  convert https://myarchivelogs.com/log1.txt ./output/log1.txt
  
  Example with flags:
  convert https://myarchivelogs.com/log1.txt ./output/log1.txt --destiny other --version 2.1
  

  ------------------------------- [Flags] -------------------------------
  
  [flag]      |   [description]           | [required]  |   [types/options]
  --version   |   To set a version log    |     no      |   [number]
  --origin    |   To select logs origin   |     no      |   ["minhacdn"] 
  --destiny   |   To select logs destiny  |     no      |   ["agora","other"] 
  
  `,
  errorMessage: (message: string) => `
  [ERROR] ${message}
  `,
};
