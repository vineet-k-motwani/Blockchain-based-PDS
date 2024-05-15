import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../Services/Contexts/AuthContext";
import { ContractContext } from "../../Services/Contexts/ContractContext";
import '../../Assests/Styles/card.css';
import Toast from "../Toast";
import stateGov_default from "../../Assests/Images/stateGov_default.jpg";
import { fetchStateGov } from "../../Services/Utils/stakeholder";

const StateGovCard = ({id, stateGovObject}) => {
  const {authState} = useContext(AuthContext);
  const {contractState} = useContext(ContractContext);
  const role = authState.stakeholder.role;
  const [stateGov, setStateGov] = useState({
    id: "00000",
    name: "",
    location: "",
    isRenewableUsed: false,
    rawProducts: [],
  });

  useEffect(() => {
    if(stateGovObject){
      setStateGov(stateGovObject);
    }
    else if(contractState.stateGovContract){
      (async() => {
        setStateGov(await fetchStateGov(
          authState.address,
          contractState.stateGovContract,
          id
        ))
      })();
    }
  }, [stateGovObject])

  const verify = async () => {
    try{
      await contractState.stateGovContract.methods.verify(id).send({from: authState.address});
      setStateGov(stateGov => {
        return {
          ...stateGov,
          isVerified: true
        }
      })
      Toast("success", "StateGov verified successfully");
    } catch(e){
      Toast("error", e.message);
    }
  }

  const update = async () => {
    try {
      await contractState.stateGovContract.methods.updateEnergy(id).send({from: authState.address});
      setStateGov(stateGov => {
        return {
          ...stateGov,
          isRenewableUsed: true
        }
      })
      Toast("success", "StateGov's energy updated");
    } catch(e){
      Toast("error", e.message);
    }
  }

  return (
    <div className="col-12 col-lg-6 my-1">
      <div className="row d-flex justify-content-around align-items-center">
        <div className="col-12 col-md-4">
          <img 
            src={stateGov_default}
            width="100%"
          />
        </div>
        <div className="col-12 col-md-8">
          <span className="card-key">Id: </span>
          <span className="card-value">{stateGov.formattedAddress}</span>
          <br/>
          <span className="card-key">Name: </span>
          <span className="card-value">{stateGov.name}</span>
          <br/>
          <span className="card-key">Location: </span>
          <span className="card-value">{stateGov.location}</span>
          <br/>
          <span className="">
            <span className="card-key"> Energy Usage: </span>
            {stateGov.isRenewableUsed?
              <span className="">
                <span className="badge bg-success">Renewable</span>
              </span>
            :
              <span className="">
                <span className="badge bg-warning">Non Renewable</span>
                {role === "admin"?
                  <span 
                    className="badge bg-dark mx-1" 
                    type="button"
                    onClick={update}
                  >
                    <i class="fa fa-fire"/>
                    Update
                  </span>
                : ""
                }
              </span>
            }
          </span>
          <br/>
          <span className="">
            <span className="card-key"> Verification: </span>
            {stateGov.isVerified?
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
                : ""
                }
              </span>
            }
          </span>
          <br/>
          <span>
            <span className="d-flex justify-content-between">
              <span className="card-key">Raw Material</span>
              <span className="card-key">Origin</span>
            </span>
            {stateGov.rawProducts.map(rawProduct => (
              <span className="d-flex justify-content-between my-1">
                <span className="card-value">{rawProduct["name"]}</span>
                {rawProduct["isVerified"]?
                  <span className="badge bg-success">Verified</span>
                :
                  <span className="badge bg-danger">Not Verified</span>
                }
              </span>
            ))}
          </span>
        </div>
      </div>
      <hr/>
    </div>
  )
}
export default StateGovCard;