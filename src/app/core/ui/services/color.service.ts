import {Injectable} from '@angular/core';
import {HueType} from '../model/hue-type.enum';
import {Hue} from '../model/hue.model';
import {PaletteType} from '../model/palette-type.enum';
import {MaterialColorService} from './material-color.service';

/**
 * Handles derived colors
 */
@Injectable({
  providedIn: 'root',
})
export class ColorService {

  /** Array of available team colors */
  public teamHues = [
    this.materialColorService.hue(PaletteType.LIGHT_BLUE, HueType._500),
    this.materialColorService.hue(PaletteType.BLUE, HueType._600),
    this.materialColorService.hue(PaletteType.LIGHT_GREEN, HueType._700),
    this.materialColorService.hue(PaletteType.LIME, HueType._800),
    this.materialColorService.hue(PaletteType.TEAL, HueType._900),
  ];

  /**
   * Constructor
   * @param materialColorService material personColor service
   */
  constructor(private materialColorService: MaterialColorService) {
  }

  /**
   * Determines a team's color
   * @param index index of the team
   * @returns color string derived from team's index
   */
  public getTeamColor(index: number) {
    const hue = this.getTeamHue(index);

    return (hue != null) ? hue.color : this.materialColorService.color(PaletteType.GREY, HueType._500);
  }

  /**
   * Determines a team's contrast
   * @param index index of the team
   * @returns contrast color string derived from team name
   */
  public getTeamContrast(index: number) {
    const hue = this.getTeamHue(index);

    return (hue != null) ? hue.contrast : this.materialColorService.contrast(PaletteType.GREY, HueType._500);
  }

  /**
   * Returns a hue picked by a hash value generated from a team's name
   * @param index index of the team
   */
  private getTeamHue(index: number): Hue {
    return this.teamHues[index % this.teamHues.length];
  }
}
