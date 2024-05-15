const { assert } = require('chai');

const StateGov = artifacts.require('StateGov');

require('chai')
    .use(require('chai-as-promised'))
    .should()


contract('StateGov',(accounts)=>{
    const admin = accounts[0];
    const centralGovAddress = accounts[1];
    const stateGovAddress = accounts[2];
    let stateGovContract;  
    
    before(async () => {
        stateGovContract = await StateGov.deployed();
    })

    it("Contract has no stateGovs",async () =>{
        var stateGovsList = await stateGovContract.getStateGovsList();
        assert.equal(stateGovsList.length,0);
    })

    it("Adding StateGov", async () =>{
        await stateGovContract.addStateGov(
            "StateGov 1",
            ["Apple","Cocoa"],
            [centralGovAddress, centralGovAddress],
            {from: stateGovAddress}
        );
        var stateGov = await stateGovContract.getStateGov(stateGovAddress);
        assert.equal(stateGov.isValue,true);            
    })

    it("Contract has stateGovs",async () =>{
        var stateGovsList = await stateGovContract.getStateGovsList();
        assert.isAbove(stateGovsList.length,0);
    })

    it('Updating StateGov Raw Products', async () => {
        await stateGovContract.updateRawProducts(
            ["Cocoa","Milk"],
            [centralGovAddress, centralGovAddress],
            {from: stateGovAddress}
        );        
        expect(await stateGovContract.getRawProductInfo(stateGovAddress,"Cocoa")).to.equal(centralGovAddress);
        expect(await stateGovContract.getRawProductInfo(stateGovAddress,"Milk")).to.equal(centralGovAddress);
    })

    describe("StateGov Verfication", async () =>{
        it("Only admin can verify StateGov", async ()=>{
            var err;
            try{
                await stateGovContract.verifyStateGov(stateGovAddress,{from: accounts[1]});
            } catch(error){
                err = error
            }
            assert.ok(err instanceof Error)
        })
        it("Verifying StateGov", async () =>{
            await stateGovContract.verifyStateGov(stateGovAddress,{from: admin});
            const stateGov = await stateGovContract.getStateGov(stateGovAddress);
            assert.equal(stateGov.isRenewableUsed, true);
        })
    })
})