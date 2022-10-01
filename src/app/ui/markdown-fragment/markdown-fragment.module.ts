import {NgModule} from '@angular/core';
import {MarkdownEditorComponent} from './markdown-editor/markdown-editor.component';
import {MarkdownFragmentDeclarations} from './markdown-fragment.declarations';
import {MarkdownFragmentImports} from './markdown-fragment.imports';
import {MarkdownPreviewComponent} from './markdown-preview/markdown-preview.component';

@NgModule({
    imports: [MarkdownFragmentImports],
    declarations: [MarkdownFragmentDeclarations],
    exports: [
        MarkdownEditorComponent,
        MarkdownPreviewComponent,
    ]
})
export class MarkdownFragmentModule {
}
