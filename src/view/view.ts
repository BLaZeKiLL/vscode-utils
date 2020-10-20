import * as vscode from 'vscode';

import { TemplateFunction } from 'dot';

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
  model : T;
  panel? : vscode.WebviewPanel;
  template? : TemplateFunction;
  onInit: () => void;
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
