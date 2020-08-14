import React from 'react';
import Table from 'react-bootstrap/Table'
import './VerbTable.css'

const VerbTable = ({
    indicative_present, 
    indicative_preterite,
    indicative_imperfect,
    indicative_conditional,
    indicative_future
}) => {
    return (
        <div>
        <h6>Indicative</h6>
        <Table size="sm">
            <thead>
                <tr>
                    <th style={{width: "100px"}}></th>
                    <th>Present</th>
                    <th>Preterite</th>
                    <th>Imperfect</th>
                    <th>Conditional</th>
                    <th>Future</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>yo</td>
                    <td>{indicative_present.form_1s}</td>
                    <td>{indicative_preterite.form_1s}</td>
                    <td>{indicative_imperfect.form_1s}</td>
                    <td>{indicative_conditional.form_1s}</td>
                    <td>{indicative_future.form_1s}</td>
                </tr>
                <tr>
                    <td>tú</td>
                    <td>{indicative_present.form_2s}</td>
                    <td>{indicative_preterite.form_2s}</td>
                    <td>{indicative_imperfect.form_2s}</td>
                    <td>{indicative_conditional.form_2s}</td>
                    <td>{indicative_future.form_2s}</td>
                </tr>
                <tr>
                    <td>él/ella/Ud.</td>
                    <td>{indicative_present.form_3s}</td>
                    <td>{indicative_preterite.form_3s}</td>
                    <td>{indicative_imperfect.form_3s}</td>
                    <td>{indicative_conditional.form_3s}</td>
                    <td>{indicative_future.form_3s}</td>
                </tr>
                <tr>
                    <td>nosotros</td>
                    <td>{indicative_present.form_1p}</td>
                    <td>{indicative_preterite.form_1p}</td>
                    <td>{indicative_imperfect.form_1p}</td>
                    <td>{indicative_conditional.form_1p}</td>
                    <td>{indicative_future.form_1p}</td>
                </tr>
                <tr>
                    <td>vosotros</td>
                    <td>{indicative_present.form_2p}</td>
                    <td>{indicative_preterite.form_2p}</td>
                    <td>{indicative_imperfect.form_2p}</td>
                    <td>{indicative_conditional.form_2p}</td>
                    <td>{indicative_future.form_2p}</td>
                </tr>
                <tr>
                    <td>ellos/ellas/Uds.</td>
                    <td>{indicative_present.form_3p}</td>
                    <td>{indicative_preterite.form_3p}</td>
                    <td>{indicative_imperfect.form_3p}</td>
                    <td>{indicative_conditional.form_3p}</td>
                    <td>{indicative_future.form_3p}</td>
                </tr>
            </tbody>
        </Table>
        </div>
    )
}

export default VerbTable;