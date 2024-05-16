import React from 'react'
import "./SaleList.css";

function SaleList(props) {
    return (
      <div>
                <tr>
                  <th>ProductName</th>
                  <th>SaleNumber</th>
                </tr>

        {props.sales && props.sales.map(sale => {
            return(
              <div key={sale.ProductId}>

                  <tr>
                    <td>{sale.Name}</td>
                    <td>{sale.TotalSell}</td>
                  </tr>

              </div>
            )
          })}
      </div>
    )
  }

  export default SaleList
