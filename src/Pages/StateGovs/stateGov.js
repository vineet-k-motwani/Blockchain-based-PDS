import { useContext, useEffect, useState } from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import StateGovCard from "../../Components/Cards/StateGovCard";
import ProductCard from "../../Components/Cards/ProductCard";
import AddRawProduct from "../../Components/Modals/AddRawProduct";
import LaunchProduct from "../../Components/Modals/LaunchProduct";
import { AuthContext } from "../../Services/Contexts/AuthContext";
import { ContractContext } from "../../Services/Contexts/ContractContext";
import { fetchProduct } from "../../Services/Utils/product";
import { fetchStateGov } from "../../Services/Utils/stakeholder";

const StateGov = () => {
  const { authState } = useContext(AuthContext);
  const { contractState } = useContext(ContractContext);
  const [stateGovAddress, setStateGovAddress] = useState(authState.address);
  const [stateGov, setStateGov] = useState({
    rawProducts: [],
    launchedProducts: [],
  });
  const [isRPModalOpen, setIsRPModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  useEffect(() => {
    if (contractState.stateGovContract) {
      (async () => {
        await loadStateGov();
      })();
    }
  }, [])

  const loadStateGov = async () => {
    if (contractState.stateGovContract) {
      const stateGovObject = await fetchStateGov(authState.address, contractState.stateGovContract, stateGovAddress);
      const launchedProducts = [];
      for (let i = 0; i < stateGovObject.launchedProductIds.length; i++) {
        const launchedProduct = await fetchProduct(authState.address, contractState.productContract, stateGovObject.launchedProductIds[i]);
        launchedProduct["stateGov"] = stateGovObject;
        launchedProducts.push(launchedProduct);
      }
      setStateGov({
        ...stateGovObject,
        launchedProducts,
      });
    }
  }

  const toggleRPModal = async () => {
    setIsRPModalOpen(!isRPModalOpen);
    await loadStateGov();
  }

  const toggleProductModal = async () => {
    setIsProductModalOpen(!isProductModalOpen);
    await loadStateGov();
  }

  return (
    <div>
      <AddRawProduct isModalOpen={isRPModalOpen} toggleModalOpen={toggleRPModal} />
      <LaunchProduct isModalOpen={isProductModalOpen} toggleModal={toggleProductModal} stateGovRP={stateGov.rawProducts} />
      <div className="d-flex justify-content-center">
        <StateGovCard id={stateGovAddress} stateGovObject={stateGov}/>
      </div>
      <div className="row d-flex align-items-start">
        <div className="col-12 col-md-6">
          <span className="d-flex justify-content-around">
            <span className="text-center heading">Incoming Ration</span>
            <i className="text-center fa fa-plus fa-2x" onClick={toggleRPModal} type="button"/>
          </span>
          {stateGov.rawProducts.map((rawProduct, index) => (
            <div key={index} className="col-12 my-2">
              <Card className="border-dark rounded">
                <CardBody>
                  <CardTitle className="">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>{rawProduct.name}</span>
                      <span>
                        {rawProduct.isVerified ? 
                          <span className="badge bg-success">Verified</span>
                        :
                          <span className="badge bg-danger">Not Verified</span>
                        }
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="badge bg-dark">Suppliers</span>
                      <br/>
                      {rawProduct.boughtFromIds.map((boughtFromId, index) => (
                        <span className="badge bg-secondary ">
                          {boughtFromId}
                        </span>
                      ))}
                    </div>
                  </CardTitle>
                </CardBody>
              </Card>
            </div>
            ))}
        </div>
        <div className="col-12 col-md-6">
          <span className="d-flex justify-content-around align-items-center">
            <span className="text-center heading">Dispatched Ration</span>
            <i className="text-center fa fa-plus fa-2x" onClick={toggleProductModal} type="button"/>
          </span>
          {stateGov.launchedProducts.map((product, index) => (
            <div key={index} className="col-12 my-2">
              <ProductCard product={product}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default StateGov;