import React from 'react';
import Table from 'react-bootstrap/Table'
import './VerbTable.css'

const VerbTable = ({
    indicative_present,
    indicative_presentperfect,
    indicative_preterite,
    indicative_imperfect,
    indicative_pastperfect,
    indicative_conditional,
    indicative_conditionalperfect,
    indicative_future,
    indicative_futureperfect,
    imperative_affirmative,
    imperative_negative,
    subjunctive_present,
    subjunctive_presentperfect,
    subjunctive_pastperfect,
    subjunctive_imperfect,
    subjunctive_future,
    subjunctive_futureperfect
}) => {
    return (
        <div>
        <h6>Indicative</h6>
        <Table size="sm">
            <thead>
                <tr>
                    <th style={{width: "100px"}}></th>
                    <th>Present</th>
                    <th>Present Perfect</th>
                    <th>Preterite</th>
                    <th>Imperfect</th>
                    <th>Past Perfect</th>
                    <th>Conditional</th>
                    <th>Conditional Perfect</th>
                    <th>Future</th>
                    <th>Future Perfect</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>yo</td>
                    <td>{indicative_present.form_1s}</td>
                    <td>{indicative_presentperfect.form_1s}</td>
                    <td>{indicative_preterite.form_1s}</td>
                    <td>{indicative_imperfect.form_1s}</td>
                    <td>{indicative_pastperfect.form_1s}</td>
                    <td>{indicative_conditional.form_1s}</td>
                    <td>{indicative_conditionalperfect.form_1s}</td>
                    <td>{indicative_future.form_1s}</td>
                    <td>{indicative_futureperfect.form_1s}</td>
                </tr>
                <tr>
                    <td>tú</td>
                    <td>{indicative_present.form_2s}</td>
                    <td>{indicative_presentperfect.form_2s}</td>
                    <td>{indicative_preterite.form_2s}</td>
                    <td>{indicative_imperfect.form_2s}</td>
                    <td>{indicative_pastperfect.form_2s}</td>
                    <td>{indicative_conditional.form_2s}</td>
                    <td>{indicative_conditionalperfect.form_2s}</td>
                    <td>{indicative_future.form_2s}</td>
                    <td>{indicative_futureperfect.form_2s}</td>
                </tr>
                <tr>
                    <td>él/ella/Ud.</td>
                    <td>{indicative_present.form_3s}</td>
                    <td>{indicative_presentperfect.form_3s}</td>
                    <td>{indicative_preterite.form_3s}</td>
                    <td>{indicative_imperfect.form_3s}</td>
                    <td>{indicative_pastperfect.form_3s}</td>
                    <td>{indicative_conditional.form_3s}</td>
                    <td>{indicative_conditionalperfect.form_3s}</td>
                    <td>{indicative_future.form_3s}</td>
                    <td>{indicative_futureperfect.form_3s}</td>
                </tr>
                <tr>
                    <td>nosotros</td>
                    <td>{indicative_present.form_1p}</td>
                    <td>{indicative_presentperfect.form_1p}</td>
                    <td>{indicative_preterite.form_1p}</td>
                    <td>{indicative_imperfect.form_1p}</td>
                    <td>{indicative_pastperfect.form_1p}</td>
                    <td>{indicative_conditional.form_1p}</td>
                    <td>{indicative_conditionalperfect.form_1p}</td>
                    <td>{indicative_future.form_1p}</td>
                    <td>{indicative_futureperfect.form_1p}</td>
                </tr>
                <tr>
                    <td>vosotros</td>
                    <td>{indicative_present.form_2p}</td>
                    <td>{indicative_presentperfect.form_2p}</td>
                    <td>{indicative_preterite.form_2p}</td>
                    <td>{indicative_imperfect.form_2p}</td>
                    <td>{indicative_pastperfect.form_2p}</td>
                    <td>{indicative_conditional.form_2p}</td>
                    <td>{indicative_conditionalperfect.form_2p}</td>
                    <td>{indicative_future.form_2p}</td>
                    <td>{indicative_futureperfect.form_2p}</td>
                </tr>
                <tr>
                    <td>ellos/ellas/Uds.</td>
                    <td>{indicative_present.form_3p}</td>
                    <td>{indicative_presentperfect.form_3p}</td>
                    <td>{indicative_preterite.form_3p}</td>
                    <td>{indicative_imperfect.form_3p}</td>
                    <td>{indicative_pastperfect.form_3p}</td>
                    <td>{indicative_conditional.form_3p}</td>
                    <td>{indicative_conditionalperfect.form_3p}</td>
                    <td>{indicative_future.form_3p}</td>
                    <td>{indicative_futureperfect.form_3p}</td>
                </tr>
            </tbody>
        </Table>
        <h6>Impertiave</h6>
        <Table>
            <thead>
                <tr>
                    <th style={{width: "100px"}}></th>
                    <th>Imperative Affimative</th>
                    <th>Imperative Negative</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>yo</td>
                    <td>-</td>
                    <td>-</td>
                </tr>
                <tr>
                    <td>tú</td>
                    <td>{imperative_affirmative.form_2s}</td>
                    <td>{imperative_negative.form_2s}</td>
                </tr>
                <tr>
                    <td>él/ella/Ud.</td>
                    <td>{imperative_affirmative.form_3s}</td>
                    <td>{imperative_negative.form_3s}</td>
                </tr>
                <tr>
                    <td>nosotros</td>
                    <td>-</td>
                    <td>-</td>
                </tr>
                <tr>
                    <td>vosotros</td>
                    <td>{imperative_affirmative.form_2p}</td>
                    <td>{imperative_negative.form_2p}</td>
                </tr>
                <tr>
                    <td>ellos/ellas/Uds.</td>
                    <td>{imperative_affirmative.form_3p}</td>
                    <td>{imperative_negative.form_3p}</td>
                </tr>
            </tbody>
        </Table>
        <h6>Subjunctive</h6>
        <Table size="sm">
            <thead>
                <tr>
                    <th style={{width: "100px"}}></th>
                    <th>Present</th>
                    <th>Present Perfect</th>
                    <th>Imperfect</th>
                    <th>Past Perfect</th>
                    <th>Future</th>
                    <th>Future Perfect</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>yo</td>
                    <td>{subjunctive_present.form_1s}</td>
                    <td>{subjunctive_presentperfect.form_1s}</td>
                    <td>{subjunctive_imperfect.form_1s}</td>
                    <td>{subjunctive_pastperfect.form_1s}</td>
                    <td>{subjunctive_future.form_1s}</td>
                    <td>{subjunctive_futureperfect.form_1s}</td>
                </tr>
                <tr>
                    <td>tú</td>
                    <td>{subjunctive_present.form_2s}</td>
                    <td>{subjunctive_presentperfect.form_2s}</td>
                    <td>{subjunctive_imperfect.form_2s}</td>
                    <td>{subjunctive_pastperfect.form_2s}</td>
                    <td>{subjunctive_future.form_2s}</td>
                    <td>{subjunctive_futureperfect.form_2s}</td>
                </tr>
                <tr>
                    <td>él/ella/Ud.</td>
                    <td>{subjunctive_present.form_3s}</td>
                    <td>{subjunctive_presentperfect.form_3s}</td>
                    <td>{subjunctive_imperfect.form_3s}</td>
                    <td>{subjunctive_pastperfect.form_3s}</td>
                    <td>{subjunctive_future.form_3s}</td>
                    <td>{subjunctive_futureperfect.form_3s}</td>
                </tr>
                <tr>
                    <td>nosotros</td>
                    <td>{subjunctive_present.form_1p}</td>
                    <td>{subjunctive_presentperfect.form_1p}</td>
                    <td>{subjunctive_imperfect.form_1p}</td>
                    <td>{subjunctive_pastperfect.form_1p}</td>
                    <td>{subjunctive_future.form_1p}</td>
                    <td>{subjunctive_futureperfect.form_1p}</td>
                </tr>
                <tr>
                    <td>vosotros</td>
                    <td>{subjunctive_present.form_2p}</td>
                    <td>{subjunctive_presentperfect.form_2p}</td>
                    <td>{subjunctive_imperfect.form_2p}</td>
                    <td>{subjunctive_pastperfect.form_2p}</td>
                    <td>{subjunctive_future.form_2p}</td>
                    <td>{subjunctive_futureperfect.form_2p}</td>
                </tr>
                <tr>
                    <td>ellos/ellas/Uds.</td>
                    <td>{subjunctive_present.form_3p}</td>
                    <td>{subjunctive_presentperfect.form_3p}</td>
                    <td>{subjunctive_imperfect.form_3p}</td>
                    <td>{subjunctive_pastperfect.form_3p}</td>
                    <td>{subjunctive_future.form_3p}</td>
                    <td>{subjunctive_futureperfect.form_3p}</td>
                </tr>
            </tbody>
        </Table>
        </div>
    )
}

export default VerbTable;