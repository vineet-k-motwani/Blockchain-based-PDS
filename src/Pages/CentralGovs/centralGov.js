import { useContext, useEffect, useState } from "react";

import CentralGovCard from "../../Components/Cards/CentralGovCard";
import Toast from "../../Components/Toast";
import { AuthContext } from "../../Services/Contexts/AuthContext";
import { ContractContext } from "../../Services/Contexts/ContractContext";
import { fetchCentralGov } from "../../Services/Utils/stakeholder";

const CentralGov = () => {
  const { authState }  = useContext(AuthContext);
  const { contractState } = useContext(ContractContext);
  const [centralGovAddress, setCentralGovAddress] = useState(authState.address);
  const [centralGov, setCentralGov] = useState({});
  const [addRPState, setAddRPState] = useState(null);

  useEffect(() => {
    if(contractState.centralGovContract){
      (async () => {
        setCentralGov(await fetchCentralGov(authState.address, contractState.centralGovContract, centralGovAddress));
      })();
    }
  },[])

  const addRawProduct = async () => {
    if(!addRPState) {
      Toast("error", "Please enter a raw product");
      return;
    }
    try{
      await contractState.centralGovContract.methods.addRawProduct(addRPState).send({from: authState.address});
      Toast("success", "Raw product added successfully");
      const temp = {
        ...centralGov,
        rawProducts: [...centralGov.rawProducts, addRPState]
      }
      setCentralGov(temp);
    } catch(e){
      Toast("error", e.message);
    }
  }

  return (
    <div className="">
      <div className = "d-flex justify-content-center">
        {centralGov.formattedAddress?
          <CentralGovCard id={centralGovAddress} centralGovObject={centralGov}/>
        :
        <div>Loading...</div>}
      </div>
      <div className="d-flex justify-content-center">
        <input type="text" placeholder="Raw product" onChange={
          (e) => {
            setAddRPState(e.target.value);
          }
        }/>
        <button onClick={addRawProduct}>Add</button>
      </div>
    </div>
  )
}
export default CentralGov;