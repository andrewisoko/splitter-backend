import { ConfigService } from "@nestjs/config";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";



@Injectable()
export class ConversionCurrencies {
    constructor(private readonly configService:ConfigService){}

    oandaClient(){

    const OANDA = require('oanda-exchange-rates');

    const client = new OANDA({
    api_key: this.configService.get<string>("OANDA_API_KEY")
    });
    Logger.log(this.configService.get<string>("OANDA_API_KEY"))


    return client
    };

    oandaGetCurrencies(clientOanda){

        clientOanda.getCurrencies('oanda', (response) => {
        if (response.success) {
            console.log('Currencies:', response.data);
        } else {
            console.error('Error fetching currencies', response.errorCode, response.errorMessage);
        }
        });
    }


}