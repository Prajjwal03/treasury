export default class ReportEndpoint {

  private _myPerformance: string
  private _myTeamPerformance: string
  private _bamReportURL: string

  get bamReportURL(): string {
    return this._bamReportURL;
  }

  set bamReportURL(value: string) {
    this._bamReportURL = value;
  }
  get myTeamPerformance(): string {
    return this._myTeamPerformance;
  }

  set myTeamPerformance(value: string) {
    this._myTeamPerformance = value;
  }
  get myPerformance(): string {
    return this._myPerformance;
  }

  set myPerformance(value: string) {
    this._myPerformance = value;
  }
}
