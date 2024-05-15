import { useContext, useEffect, useState } from "react";
import { ContractContext } from "../../Services/Contexts/ContractContext";
import '../../Assests/Styles/verify.page.css';
import CentralGovCard from "../../Components/Cards/CentralGovCard";

const VerifyCentralGov = () => {
  const {contractState} = useContext(ContractContext);
  const [addresses, setAddresses] = useState([]);
  useEffect(() => {
    (async() => {
      if(contractState.centralGovContract){
        setAddresses(await contractState.centralGovContract.methods.getAddresses().call());
      }
    })();
  }, [contractState.centralGovContract])
  return (
    <div className="verify">
      <div className="heading">Verify CentralGov</div>
      <div className="row">
        {addresses.map(address => (
          <CentralGovCard id = {address} />
        ))}
      </div>
    </div>
  )
}
export default VerifyCentralGov;