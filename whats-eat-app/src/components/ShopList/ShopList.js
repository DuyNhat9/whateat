import React from 'react'
import "./ShopList.css";
import { APIService } from '../../components/APIService/APIService'
import { Link } from "react-router-dom";

function ShopList(props) {

  const deleteStore = (store) => {
    APIService.DeleteStore(store.StoreId)
    .then(() => props.deleteStore(store))
  }

  return (
    <div>

              <tr>
                <th>ShopName</th>
                <th>PhoneNumber</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
              
      {props.stores && props.stores.map(store => {
          return(
            <div key={store.StoreId}>
                <tr>

                  <td><Link to="/shop">{store.ShopName}</Link></td>
                  <td>{store.PhoneNumber}</td>
                  <td>{store.Address}, {store.ProvinceCode}, {store.DistrictCode}, {store.WardCode}</td>

                  <td>
                    <div className = "row" >
                      <div className = "col-md-1" >
                      <button className = "btn btn-primary">
                      Update </button>
                      </div>

                      <div className = "col" >
                      <button className = "btn btn-danger"
                      onClick={()  => deleteStore(store)}> Delete </button>
                      </div>
                    </div>
                  </td>
                </tr>

            </div>
          )
        })}
    </div>
  )
}

export default ShopList
