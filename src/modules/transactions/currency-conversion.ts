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

    async convertAmount(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
        const client = this.oandaClient();
        
        return new Promise((resolve, reject) => {
            client.convert(fromCurrency, toCurrency, amount, (response) => {
                if (response.success) {
                    Logger.log(`Converted ${amount} ${fromCurrency} to ${response.data.amount} ${toCurrency}`);
                    resolve(response.data.amount);
                } else {
                    Logger.error(`Conversion failed: ${response.errorCode} - ${response.errorMessage}`);
                    reject(new NotFoundException(`Currency conversion failed: ${response.errorMessage}`));
                }
            });
        });
    }

        async processTransaction(senderAmount: number, fromCurrency: string, toCurrency: string): Promise<number> {
        try {
            if (fromCurrency === toCurrency) {
                Logger.log(`Same currency (${fromCurrency}), no conversion needed`);
                return senderAmount;
            }

            const receivedAmount = await this.convertAmount(senderAmount, fromCurrency, toCurrency);
            
            Logger.log(`Transaction: ${senderAmount} ${fromCurrency} -> ${receivedAmount} ${toCurrency}`);
            return receivedAmount;

        } catch (error) {
            Logger.error(`Transaction processing failed: ${error.message}`);
            throw error;
        }
    }

}