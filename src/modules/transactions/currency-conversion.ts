import { ConfigService } from "@nestjs/config";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import axios from 'axios';



@Injectable()
export class ConversionCurrencies {
    constructor(private readonly configService:ConfigService){}

    oandaClient(){

        const OANDA = require('oanda-exchange-rates');

        const client = new OANDA({
        api_key: this.configService.get<string>("OANDA_API_KEY")
        });
        return client
    };

    private getOandaConfig() {
        const apiKey = this.configService.get<string>("OANDA_API_KEY");
        
        if (!apiKey) {
            throw new Error("OANDA_API_KEY is not configured");
        }

        return {
            apiKey,
            baseUrl: "https://api-fxtrade.oanda.com/v3"
        };
    }

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
        try {
            if (fromCurrency.toUpperCase() === toCurrency.toUpperCase()) {
                return amount;
            }

            const apiKey = this.configService.get<string>("OANDA_API_KEY");
            
            if (!apiKey) {
                throw new Error("OANDA_API_KEY is not configured");
            }

            // Use a free forex API that doesn't require complex setup
            const response = await axios.get(
                `https://api.fxratesapi.com/latest`,
                {
                    params: {
                        base: fromCurrency,
                        symbols: toCurrency
                    },
                    timeout: 5000 
                }
            );

            const rate = response.data.rates[toCurrency];
            
            if (!rate) {
                throw new Error(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
            }

            const convertedAmount = amount * rate;
            const roundedAmount = Math.round(convertedAmount * 100) / 100; 

            Logger.log(`Converted ${amount} ${fromCurrency} to ${roundedAmount} ${toCurrency} (rate: ${rate})`);
            
            return roundedAmount;

        } catch (error) {
            Logger.error(`Conversion failed: ${error.message}`);
            return 0
        };
      };
    };

