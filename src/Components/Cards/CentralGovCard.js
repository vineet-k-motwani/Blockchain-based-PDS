import { useContext, useState, useEffect } from "react";

import { AuthContext } from "../../Services/Contexts/AuthContext";
import { ContractContext } from "../../Services/Contexts/ContractContext";
import Toast from '../Toast';
import '../../Assests/Styles/card.css';
import centralGov_default from '../../Assests/Images/centralGov_default.jpg';
import { fetchCentralGov } from "../../Services/Utils/stakeholder";

const CentralGovCard = ({id, centralGovObject}) => {
  const {authState} = useContext(AuthContext);
  const {contractState} = useContext(ContractContext);
  const role = authState.stakeholder.role;
  const [centralGov, setCentralGov] = useState({
    id: "00000",
    name: "",
    location: "",
    rawProducts: [],
  });

  useEffect(() => {
    if(centralGovObject){
      setCentralGov(centralGovObject);
    }
    else if(contractState.centralGovContract){
      (async() => {
        setCentralGov(await fetchCentralGov(authState.address, contractState.centralGovContract, id));
      })();
    }
  }, [centralGovObject])

  const verify = async () => {
    try{
      await contractState.centralGovContract.methods.verify(id).send({from: authState.address});
      setCentralGov(centralGov => {
        return {
          ...centralGov,
          isVerified: true
        }
      })
      Toast("success", "CentralGov verified successfully");
    } catch(e){
      Toast("error", e.message);
    }
  }

  return (
    <div className="col-12 col-lg-6 my-1">
      <div className="row d-flex justify-content-around align-items-center">
        <div className="col-12 col-md-4">
          <img 
            src={centralGov_default}
            width="100%"
          />
        </div>
        <div className="col-12 col-md-8">
          <span className="card-key">Id: </span>
          <span className="card-value">{centralGov.formattedAddress}</span>
          <br/>
          <span className="card-key">Name: </span>
          <span className="card-value">{centralGov.name}</span>
          <br/>
          <span className="card-key">Location: </span>
          <span className="card-value">{centralGov.location}</span>
          <br/>
          <span className="card-key">Raw Products: </span>
          {centralGov.rawProducts.map(rawProduct => (
            <span className="card-value">{rawProduct+", "}</span>
          ))}
          <br/>
          <span className="">
            <span className="card-key"> Verification: </span>
            {centralGov.isVerified?
              <span className="">
                <span className="badge bg-success">Verified</span>
              </span>
            :
              <span className="">
                <span className="badge bg-warning">Not Verified</span>
                {role === "admin"?
                  <span 
                    className="badge bg-dark mx-1" 
                    type="button"
                    onClick={verify}
                  >
                    <i class="fa fa-certificate"/>
                    Verify
                  </span>
                : "" }
              </span>
            }
          </span>
        </div>
      </div>
      <hr/>
    </div>
  )
}
export default CentralGovCard;