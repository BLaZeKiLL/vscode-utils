import * as vscode from 'vscode';

export interface ViewMeta {
  type: string;
  title: string;
  view: {
    template: string,
    style?: string,
    codeBehind?: string
  }
  showOptions: vscode.ViewColumn | {viewColumn : vscode.ViewColumn, preserveFocus?: boolean};
  options?: vscode.WebviewPanelOptions & vscode.WebviewOptions;
}

export interface IView<T> {
  model() : T; 
}

export const View = (config : ViewMeta) : Function => {
  return (target : { new (...args: any[]): IView<any>}) => {
    return class extends target {
      type = config.type;
      title = config.title;
      showOptions = config.showOptions;
      view = config.view;
      options? = config.options;
    };
  };
};
