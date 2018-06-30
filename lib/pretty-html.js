'use babel';

import linter from 'ibg-html-pretty';
import PrettyHtmlView from './pretty-html-view';
import { CompositeDisposable } from 'atom';

export default {

  prettyHtmlView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.prettyHtmlView = new PrettyHtmlView(state.prettyHtmlViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.prettyHtmlView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'pretty-html:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.prettyHtmlView.destroy();
  },

  serialize() {
    return {
      prettyHtmlViewState: this.prettyHtmlView.serialize()
    };
  },

  toggle() {
    let editor;
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getText();
      let output = linter.lint(selection);
      editor.setText(output);
    }
  }

};
