import axios from "axios";

export class APIService {

  static InsertStore(ShopName, PhoneNumber, Email, Address, ProvinceCode, DistrictCode, WardCode, Description){
    return axios({//need data
      method: "POST",
      headers: {
        'Content-Type':'application/json'
      },
      url: `${process.env.REACT_APP_PYTHON_API_KEY}/add`,
        ShopName: JSON.stringify(ShopName),
        PhoneNumber: JSON.stringify(PhoneNumber),
        Address: JSON.stringify(Address),
        ProvinceCode: JSON.stringify(ProvinceCode),
        DistrictCode: JSON.stringify(DistrictCode),
        WardCode: JSON.stringify(WardCode),
        Description: JSON.stringify(Description),
        Email: JSON.stringify(Email)
    })
      .then(resp => resp.json())
}

  static DeleteStore(StoreId){
    return axios({//need data
      method: "DETELE",
      url: `${process.env.REACT_APP_PYTHON_API_KEY}/delete/${StoreId}`,
      headers: {
        'Content-Type':'applications/json'
      }
    })
}
}