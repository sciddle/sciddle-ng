import {animate, state, style, transition, trigger} from '@angular/animations';

export enum TeamCountSelectionState {ACTIVATED, DEACTIVATED }

/**
 * Contains the animations for the component
 */
export const Animations = {
  teamCountSelectionAnimation: trigger('teamCountSelectionAnimation', [
    state(`${TeamCountSelectionState.DEACTIVATED}`, style({
      opacity: '0'
    })),
    state(`${TeamCountSelectionState.ACTIVATED}`, style({
      opacity: '1'
    })),
    transition(`${TeamCountSelectionState.DEACTIVATED} => ${TeamCountSelectionState.ACTIVATED}`, animate('300ms ease-in')),
    transition(`${TeamCountSelectionState.ACTIVATED} => ${TeamCountSelectionState.DEACTIVATED}`, animate('300ms ease-out'))
  ])
};
