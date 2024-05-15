import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { contractReducer } from "../Reducers/ContractReducer";

import MainContract from '../../Smart-Contract/ABI/Main.json';
import StakeholderContract from '../../Smart-Contract/ABI/Stakeholder.json';
import CentralGovContract from '../../Smart-Contract/ABI/CentralGov.json';
import StateGovContract from '../../Smart-Contract/ABI/StateGov.json';
import ProductContract from '../../Smart-Contract/ABI/Product.json';
import { 
  contractStateMain, 
  contractStateProduct,
  contractStateCentralGov, 
  contractStateStateGov,
  contractStateStakeholder, 
  contractStateStats 
} from '../Actions/ContractActionCreator';
import { authStateStakeholder } from '../Actions/AuthActionCreator';
import { AuthContext } from "./AuthContext";

export const ContractContext = createContext();
export const ContractContextProvider = ({children}) => {
  const [contractState, contractDispatch] = useReducer(contractReducer, {
    isLoading: false,
    errMess: null,
    mainContract: null,
    centralGovContract: null,
    stateGovContract: null,
    stakeholderContract: null,
    productContract: null,
    stats: {
      productsCount: 0,
      transactionsCount: 0,
      reviewsCount: 0
    }
  })
  const [networkId, setNetworkId] = useState(null);
  const { authState, authDispatch } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      if(authState.isWeb3Enabled){
        const web3 = window.web3;
        const networkId = await web3.eth.net.getId();
        setNetworkId(networkId);
        const main = new web3.eth.Contract(MainContract.abi, MainContract.networks[networkId].address);
        contractDispatch(contractStateMain(main));
        const product  = new web3.eth.Contract(ProductContract.abi, ProductContract.networks[networkId].address);
        contractDispatch(contractStateProduct(product));
        const centralGov = new web3.eth.Contract(CentralGovContract.abi, CentralGovContract.networks[networkId].address);
        contractDispatch(contractStateCentralGov(centralGov));
        const stateGov = new web3.eth.Contract(StateGovContract.abi, StateGovContract.networks[networkId].address);
        contractDispatch(contractStateStateGov(stateGov));
        const stats = {};
        stats["productsCount"] = await product.methods.getProductsCount().call();
        stats["transactionsCount"] = await product.methods.getTransactionsCount().call();
        stats["reviewsCount"] = await product.methods.getReviewsCount().call();
        contractDispatch(contractStateStats(stats));
      }
    })();
  }, [authState.isWeb3Enabled])

  useEffect(() => {
    (async () => {
      if(authState.isAuthenticated && contractState.mainContract){
        const web3 = window.web3;
        const role = await contractState.mainContract.methods.getRole(authState.address).call();
        if( role === "centralGov"){
          const centralGov = new web3.eth.Contract(CentralGovContract.abi, CentralGovContract.networks[networkId].address);
          contractDispatch(contractStateStakeholder(centralGov));
        }
        else if(role === 'stateGov'){
          const stateGov = new web3.eth.Contract(StateGovContract.abi, StateGovContract.networks[networkId].address);
          contractDispatch(contractStateStakeholder(stateGov));
        }
        else {
          const stakeholder = new web3.eth.Contract(StakeholderContract.abi, StakeholderContract.networks[networkId].address);
          contractDispatch(contractStateStakeholder(stakeholder));
        }
      }
    })();
  }, [authState.isAuthenticated, contractState.mainContract])

  useEffect(() => {
    (async () => {
      await loadStakeholder();
    })();
  }, [contractState.stakeholderContract])

  const loadStakeholder = async () => {
    if(contractState.stakeholderContract){
      let stakeholderDetails = await contractState.stakeholderContract.methods.get(authState.address).call({from: authState.address});
      stakeholderDetails = {
        id: stakeholderDetails.id,
        name: stakeholderDetails.name,
        location: stakeholderDetails.location,
        role: stakeholderDetails.role === "" ? "new" : stakeholderDetails.role,
        isRegistered: stakeholderDetails.role === "" ? false : true,
        isVerified: stakeholderDetails.isVerified
      }
      const role = await contractState.mainContract.methods.getRole(authState.address).call();
      if(role == "admin"){
        stakeholderDetails.role = role;
      }
      authDispatch(authStateStakeholder(stakeholderDetails));
    }
  }

  const updateStats = async () => {
    const stats = {};
    stats["productsCount"] = await contractState.productContract.methods.getProductsCount().call();
    stats["transactionsCount"] = await contractState.productContract.methods.getTransactionsCount().call();
    stats["reviewsCount"] = await contractState.productContract.methods.getReviewsCount().call();
    contractDispatch(contractStateStats(stats));
  }

  return (
    <ContractContext.Provider value={{contractState, contractDispatch, updateStats, loadStakeholder}}>
      {children}
    </ContractContext.Provider>
  )

}
