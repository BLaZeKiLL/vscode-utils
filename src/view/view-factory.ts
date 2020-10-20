import * as vscode from 'vscode';
import * as dot from 'dot';
import * as fs from 'fs';
import * as path from 'path';

import { IView, ViewMeta } from './view';

const inflate = (view : IView<any>, context: vscode.ExtensionContext) : vscode.WebviewPanel => {
  const meta = view as any as ViewMeta;

  if (meta === undefined || meta === null) {
    throw new Error('View decorator not added');
  }

  let panel = vscode.window.createWebviewPanel(meta.type, meta.title, meta.showOptions, meta.options);

  view.panel = panel;

  const templatePath = path.join(
    context.extensionPath,
    'dist',
    'views',
    meta.view.template
  );

  const template = dot.compile(fs.readFileSync(templatePath).toString("utf-8"));

  view.template = template;

  panel.webview.html = template(view.model);
  
  if (context) {
    panel.onDidDispose(() => {
      panel = undefined as any;
    }, undefined, context.subscriptions);
  }

  view.onInit();

  return panel;
};

export const ViewFactory = {
  inflate : inflate
};