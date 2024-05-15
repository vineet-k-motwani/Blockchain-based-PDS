import { useContext, useEffect, useState } from "react";
import { ContractContext } from "../../Services/Contexts/ContractContext";
import '../../Assests/Styles/verify.page.css';
import StateGovCard from "../../Components/Cards/StateGovCard";

const VerifystateGov = () => {
  const {contractState} = useContext(ContractContext);
  const [addresses, setAddresses] = useState([]);
  useEffect(() => {
    (async() => {
      if(contractState.stateGovContract){
        setAddresses(await contractState.stateGovContract.methods.getAddresses().call());
      }
    })();
  }, [contractState.stateGovContract])
  return (
    <div className="verify">
      <div className="heading">Verify StateGov</div>
      <div className="row">
        {addresses.map(address => (
          <StateGovCard id={address} />
        ))}
      </div>
    </div>
  )
}
export default VerifystateGov;