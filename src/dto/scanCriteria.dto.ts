
export class ScanCriteriaDto {
    id: string;
    status: string;
    owner: string;
    createdAt: Date;
    lastScannedAt: Date;
    lastTriggeredAt: Date;
    name: string;
    minTVL: number;
    maxTVL: number;
    minAPYPercent: number;
    networks: string[];
    mandatoryRiskLevel: string[];

    constructor(_params: any) {
        this.id = _params.id ? _params.id : null;
        this.status = _params.status ? _params.status : null;
        this.owner = _params.owner ? _params.owner : null;
        this.createdAt = _params.createdAt ? _params.createdAt : null;
        this.lastScannedAt = _params.lastScannedAt ? _params.lastScannedAt : null;
        this.lastTriggeredAt = _params.lastTriggeredAt ? _params.lastTriggeredAt : null;
        this.name = _params.name ? _params.name : null;
        this.minTVL = _params.minTVL ? _params.id : null;
        this.maxTVL = _params.id ? _params.id : null;
        this.minAPYPercent = _params.minAPYPercent ? _params.minAPYPercent : null;
        this.networks = _params.networks ? _params.networks : null;
        this.mandatoryRiskLevel = _params.mandatoryRiskLevel ? _params.mandatoryRiskLevel : null;
    }

}