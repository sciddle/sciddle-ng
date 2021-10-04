import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * Displays markdown editor
 */
@Component({
  selector: 'app-markdown-editor',
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkdownEditorComponent {

  /** Text to be displayed */
  @Input() public text = '';
  /** Placeholder to be used */
  @Input() public placeholder = '';
  /** Whether component is readonly or not */
  @Input() public readonly = false;
  /** Event emitter indicating changes in description */
  @Output() public textChangedEmitter = new EventEmitter<string>();

  //
  // Actions
  //

  /**
   * Handles click on clear button
   */
  public onClearButtonClicked() {
    this.text = '';
  }

  /**
   * Handles changes in description markdownText
   */
  public onTextChanged(text: string) {
    this.text = text;
    this.textChangedEmitter.emit(text);
  }
}
