export const fetchCentralGov = async (curr_address, centralGovContract, id) => {
  const response = await centralGovContract.methods.getCentralGov(id).call({from: curr_address});
  return {
    ...response.centralGov,
    formattedAddress: id.substring(0, 6) + "..." + id.substring(id.length - 4, id.length),
    rawProducts: response.rawProducts
  }
}

export const fetchStateGov = async (curr_address, stateGovContract, id) => {
  const response = await stateGovContract.methods.getStateGov(id).call({from: curr_address});
  return {
    ...response.stateGov,
    isRenewableUsed: response.isRenewableUsed,
    formattedAddress: id.substring(0, 6) + "..." + id.substring(id.length - 4, id.length),
    rawProducts: response.rawProducts,
    launchedProductIds: response.launchedProductIds
  }
}

export const fetchStakeholder = async (curr_address, stakeholderContract, id) => {
  const response = await stakeholderContract.methods.get(id).call({from: curr_address});
  return {
    ...response,
    formattedAddress: id.substring(0, 6) + "..." + id.substring(id.length - 4, id.length),
  }
}

export const formattedAddress = (address) => {
  return address.substring(0,6) + "..." + address.substring(address.length - 4);
}