import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ScanCriteria } from './schemas/scanCriteria.schema';
import { ScanCriteriaDto } from './dto/scanCriteria.dto';


const beefy = require('./lib/beefyApis.js')
const myVaults = ['joe-auto-weth-usdc']
//emailer.start(config)
//emailer.sendMail("STARTED", "")


// searchCriteria={ 
//     name:""
//     networks:"polygon,cronos,linea,arbitrum,optimism,zksync,base,gnosis",
//     mandatoryRiskLevel:"CONTRACTS_VERIFIED,AUDIT,COMPLEXITY_LOW,BATTLE_TESTED,IL_LOW",
//     minTVL:300000,
//     maxTVL:300000,
//     minAPYPercent:25.4,
//     mandatoryAssets:"USDC,USDT,ETH,MATIC"
// }
export const listVaults = async (apys, tvl, searchCriteria) => {

    const includesAll = (arr, values) => values.every(v => arr.includes(v));
    const includesAny = (arr, values) => values.some(v => arr.includes(v));
    const name = searchCriteria.name && searchCriteria.name.trim().length > 0 ? searchCriteria.name.trim().toLowerCase() : undefined;
    const networks = searchCriteria.networks ? searchCriteria.networks.split(',') : undefined;
    const mandatoryAssets = searchCriteria.mandatoryAssets ? searchCriteria.mandatoryAssets.split(',') : undefined;
    const mandatoryRiskLevel = searchCriteria.mandatoryRiskLevel ? searchCriteria.mandatoryRiskLevel.split(',') : undefined;
    const minAPYPercent = searchCriteria.minAPYPercent && !isNaN(searchCriteria.minAPYPercent) ? parseFloat(searchCriteria.minAPYPercent) : undefined;
    const minTVL = searchCriteria.minTVL && !isNaN(searchCriteria.minTVL) ? parseFloat(searchCriteria.minTVL) : undefined;
    const maxTVL = searchCriteria.maxTVL && !isNaN(searchCriteria.maxTVL) ? parseFloat(searchCriteria.maxTVL) : undefined;

    const tvlkeys = Object.keys(tvl)

    const vaults = await beefy.getVaults()


    let filtered = vaults.filter((item) => {
        return myVaults.indexOf(item.id,) > -1 ||
            (item.status == 'active' &&
                (undefined == name || item.name.toLowerCase().indexOf(name) != -1) &&
                (undefined == networks || networks.indexOf(item.network) != -1) &&
                (undefined == minAPYPercent || apys[item.id] >= minAPYPercent / 100.0) &&
                (undefined == mandatoryRiskLevel || (item.risks && item.risks.length > 0 && includesAll(item.risks, mandatoryRiskLevel))) &&
                (undefined == mandatoryAssets || (item.assets && item.assets.length > 0 && includesAny(item.assets, mandatoryAssets))))
    })

    tvlkeys.forEach((key) => {
        const subkeys = Object.keys(tvl[key])
        subkeys.forEach((sk) => {
            filtered = filtered.map((i) => {
                if (i.id == sk) {
                    i.tvl = tvl[key][sk]
                }
                return i
            })
        })
    })

    filtered = filtered.filter((item) => {
        return myVaults.indexOf(item.id,) > -1 || undefined == minTVL || item.tvl >= minTVL
    })

    filtered = filtered.filter((item) => {
        return myVaults.indexOf(item.id,) > -1 || undefined == maxTVL || item.tvl < maxTVL
    })

    return filtered.map((item) => {
        item.myVault = myVaults.indexOf(item.id,) > -1
        item.apyPercent = Math.trunc(apys[item.id] * 100000) / 1000
        item.dailyPercent = Math.trunc(apys[item.id] / 365.0 * 100000) / 1000
        item.warnings = []
        if (undefined != minTVL && item.tvl < minTVL) { item.warnings.push('MINTVL_THRESHOLD') }
        if (undefined != maxTVL && item.tvl >= maxTVL) { item.warnings.push('MAX_THRESHOLD') }
        if (item.status !== 'active') { item.warnings.push('STATUS_NOT_ACTIVE') }
        if (undefined != minAPYPercent && item.apyPercent < minAPYPercent) { item.warnings.push('APY_THRESHOLD') }
        if (undefined != mandatoryRiskLevel && item.risks && item.risks.length > 0 && false == includesAll(item.risks, mandatoryRiskLevel)) { item.warnings.push('RISK_LEVEL') }
        if (undefined != mandatoryAssets && item.assets && item.assets.length > 0 && false == includesAny(item.assets, mandatoryAssets)) { item.warnings.push('ASSET_MISSING') }
        return item
    })

}

export const listAPYs = async () => {
    return await beefy.getAPY()
}

export const listTVL = async () => {
    return await beefy.getTVL()
}

export const mapResult = (vaults) => {
    return vaults.map((item) => {
        return {
            "id": item.id,
            "name": item.name,
            "assets": item.assets,
            "type": item.type,
            "addLiquidityUrl": item.addLiquidityUrl,
            "removeLiquidityUrl": item.removeLiquidityUrl,
            "network": item.network,
            "tvl": item.tvl,
            "apyPercent": item.apyPercent,
            "dailyPercent": item.dailyPercent,
            "platformId": item.platformId,
            "status": item.status,
            "risks": item.risks,
            "myVault": item.myVault,
            "myVaultWarning": item.warnings,
            "isGovVault": item.isGovVault,
            "pricePerFullShare": item.pricePerFullShare,
            "tokenDecimals": item.tokenDecimals,
            "oracle": item.oracle,
            "oracleId": item.oracleId,
        }
    })
}

export const search = async (searchCriteria) => {
    console.log("searchCriteria", searchCriteria)
    let apys = await listAPYs()
    let tvls = await listTVL()
    let vaults = await listVaults(apys, tvls, searchCriteria)
    return vaults
}

// module.exports = {search}
const fromDto = (doc: any, criteriaDto: ScanCriteriaDto) => {
    doc.status = criteriaDto.status ? criteriaDto.status : doc.status;
    doc.owner = criteriaDto.owner ? criteriaDto.owner : doc.owner;
    doc.name = criteriaDto.name ? criteriaDto.name : doc.name;
    doc.minTVL = criteriaDto.minTVL ? criteriaDto.minTVL : doc.minTVL;
    doc.maxTVL = criteriaDto.maxTVL ? criteriaDto.maxTVL : doc.maxTVL;
    doc.minAPYPercent = criteriaDto.minAPYPercent ? criteriaDto.minAPYPercent : doc.minAPYPercent;
    doc.networks = criteriaDto.networks ? criteriaDto.networks : doc.networks;
    doc.mandatoryRiskLevel = criteriaDto.mandatoryRiskLevel ? criteriaDto.mandatoryRiskLevel : doc.mandatoryRiskLevel;
}

const fromDocument = (doc: any, existingDoc: any) => {
    console.log(" existingDoc.owner",  existingDoc.owner) ;
    doc.status = existingDoc.status ? existingDoc.status : null;
    doc.owner = existingDoc.owner ? existingDoc.owner : null;
    doc.name = existingDoc.name ? existingDoc.name : null;
    doc.minTVL = existingDoc.minTVL ? existingDoc.minTVL : null;
    doc.maxTVL = existingDoc.maxTVL ? existingDoc.maxTVL : null;
    doc.minAPYPercent = existingDoc.minAPYPercent ? existingDoc.minAPYPercent : null;
    doc.networks = existingDoc.networks ? existingDoc.networks : null;
    doc.mandatoryRiskLevel = existingDoc.mandatoryRiskLevel ? existingDoc.mandatoryRiskLevel : null;

    console.log("From doc YYYY existingDoc", existingDoc )
    console.log("From doc YYYY doc", doc )

}

@Injectable()
export class VaultService {
    constructor(@InjectModel(ScanCriteria.name) private scanCriteria: Model<ScanCriteria>) { }

    async findAll(criteria): Promise<any> {
        //TODO: default criteria should be active :true
        return await search(criteria);
    }
    async add(criteria: ScanCriteriaDto): Promise<any> {
        let existing = null;

        let createdCriteria = new this.scanCriteria();

        if (criteria.id) {
            existing = await this.scanCriteria.find().exec();
            console.log("existing", existing);
        }

        if (existing && existing.length > 0) {
            //fromDocument(createdCriteria, existing[0]);
            createdCriteria = existing[0] ; 
            fromDto(createdCriteria, criteria);
            createdCriteria.status = "UPDATED";
            createdCriteria.updatedAt = new Date()
            createdCriteria.isNew = false
        }
        else {
            fromDto(createdCriteria, criteria);
            createdCriteria.status = "NEW";
            createdCriteria.createdAt = new Date()
            createdCriteria.isNew = true
        }

        let result = await createdCriteria.save()
        console.log("result", result)
        return result;
    }
}

