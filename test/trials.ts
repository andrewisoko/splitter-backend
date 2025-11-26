
    // async withdrawTransaction(accountId:number,withdraw:number,userName:string){

    //             const queryRunner = this.dataSource.createQueryRunner();
    //             let transactionFailed;
    //             let transaction;

    //             await queryRunner.connect();
    //             await queryRunner.startTransaction();
                
    //             try {

    //                 const account = await queryRunner.manager.findOne(Account, {
    //                     where: { accountID: accountId },
    //                     lock:{mode:'pessimistic_write'}});

    //                 if (!account) throw new NotFoundException('Account not found');  
         
    //                 /** valid accoun't user process */
    //                 const accountWithUser = await  queryRunner.manager.findOne(Account, {
    //                 where: { accountID: accountId },
    //                 relations: ['user']
    //                 }); 
    //                 if (!accountWithUser) throw new  NotFoundException("account not found")
    //                 if (accountWithUser.user.userName !== userName) throw new UnauthorizedException("You do not own this account");
    //                 /**  until here  */

    //                 if(accountWithUser.balance <= 0) throw new BadRequestException('Invald amount');
    //                 if(accountWithUser.balance < withdraw) throw new BadRequestException('invald amount'); 
                    
    //                 accountWithUser.balance -= withdraw
    //                 accountWithUser.updatedAt = new Date()

    //                 await queryRunner.manager.save(accountWithUser)

    //                 transaction = this.
    //                 transactionOutcome.
    //                 transactionFieldsUpdate(withdraw,TRANSACTIONS_TYPE.WITHDRAW,STATUS.COMPLETED,accountId)

    //                 transaction = await queryRunner.manager.save(transaction)

    //                 await queryRunner.commitTransaction();
    //                 Logger.log("Transaction Completed!")

    //                 return transaction;

    //             } catch (error) {

    //                 await queryRunner.rollbackTransaction();
    //                 transactionFailed = this.
    //                 transactionOutcome.
    //                 transactionFieldsUpdate(withdraw,TRANSACTIONS_TYPE.WITHDRAW,STATUS.FAILED,accountId)
    //                 throw error; 
                    
    //             } finally{
    //                 await queryRunner.release();
    //                 if (transactionFailed) {
    //                     await this.transactionsRepository.save(transactionFailed);
    //                     Logger.log("Transaction Failed")
    //                     }
    //             }
    //         }