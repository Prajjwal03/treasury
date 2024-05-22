export class BranchInfo {
  private _branchName: string;
  private _branchCode: string;

  get branchName(): string {
    return this._branchName;
  }

  set branchName(value: string) {
    this._branchName = value;
  }

  get branchCode(): string {
    return this._branchCode;
  }

  set branchCode(value: string) {
    this._branchCode = value;
  }
}
