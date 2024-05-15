const { assert } = require('chai');

const CentralGov = artifacts.require('CentralGov');

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('CentralGov',(accounts)=>{
    const admin = accounts[0];
    const centralGovAddress = accounts[1];
    let centralGovContract;

    before(async()=>{
        centralGovContract = await CentralGov.deployed();
    })


    it("Contract has no centralGovs",async () =>{
        var centralGovsList = await centralGovContract.getCentralGovsList();
        assert.equal(centralGovsList.length,0);
    })

    it("Adding CentralGov", async () =>{
        await centralGovContract.addCentralGov("CentralGov1","South India",["Milk","Cocoa"],{from: centralGovAddress});
        var centralGov = await centralGovContract.getCentralGov(centralGovAddress);
        assert.equal(centralGov.isValue,true);            
    })
    
    it("Contract has centralGovs",async () =>{
        var centralGovsList = await centralGovContract.getCentralGovsList();
        assert.isAbove(centralGovsList.length,0);
    })

    describe("CentralGov Verfication", async () =>{
        it("Only admin can verify centralGov", async ()=>{
            var err;
            try{
                await centralGovContract.verifyCentralGov(centralGovAddress,{from: accounts[2]});
            } catch(error){
                err = error
            }
            assert.ok(err instanceof Error)
        })
        it("Verifying CentralGov", async () =>{
            await centralGovContract.verifyCentralGov(centralGovAddress,{from: accounts[0]});
            const centralGov = await centralGovContract.getCentralGov(centralGovAddress);
            assert.equal(centralGov.isVerified, true);
        })
    })

})