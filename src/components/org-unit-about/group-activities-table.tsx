import {useEffect, useState} from 'react';

import {Link} from 'react-router-dom';

import {Table, TablePagination} from '../common/table';
import {Header} from '../header';
import {GroupActivitiesColumns} from '../../table/group-activities';
import {useTable} from '../../hooks/use-table';
import {GroupActivities} from '../../types/org-unit-about';
import React from 'react';
import './form-styles.css';

type Props = {
    data: GroupActivities[];
    orgUnitId: string;
    detailsId: string;
};

export function GroupActivitiesTable(props: Props) {
    const credentials = btoa(`Skununka:Nomisr123$$$$}`);
    const [search, setSearch] = useState('');
    const [formVisible, setFormVisible] = useState(false);
    const [formData, setFormData] = useState({
        beneficiaryId: '',
        name: '',
        code: '',
        directIndirect: '',
        sex: '',
        age: ''
    }); // Add initial form data
    // console.log("about data", props.data);
    const [message, setMessage] = useState(null); // State for success or error message
    const [isError, setIsError] = useState(false); // State to track if the message is an error
    const orgUnitId = props.orgUnitId;
    const [trigger, setTrigger] = useState(0);
    const [isLoading, setIsLoading] = useState(false); //loader for code
    const [loading, setLoading] = useState(false); //loader for saving entry

    const table = useTable({
        data: props.data,
        columns: GroupActivitiesColumns(credentials, setMessage, setIsError),
        globalFilter: search,
        setGlobalFilter: setSearch,
    });

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try {
                // First request: Fetch the organization unit code
                const orgUnitCodeResponse = await fetch(
                    // `${process.env.REACT_APP_BASE_URL}/ovc/api/organisationUnits/${props.orgUnitId}`,
                    `/ovc/api/organisationUnits/${props.orgUnitId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${credentials}`,
                        },
                    }
                );
                const orgUnitCodeData = await orgUnitCodeResponse.json();
                const orgUnitCode = orgUnitCodeData.code;
                // setOrgUnitcode(orgUnitCode);

                // Wait for the orgUnitCode to be set before making the second request
                if (orgUnitCode) {
                    // Second request: Fetch the generated code using the organization unit code
                    const codeResponse = await fetch(
                        // `${process.env.REACT_APP_BASE_URL}/ovc/api/trackedEntityAttributes/oqabsHE0ZUI/generate?ORG_UNIT_CODE=${orgUnitCode}`,
                        `/ovc/api/trackedEntityAttributes/oqabsHE0ZUI/generate?ORG_UNIT_CODE=${orgUnitCode}`,
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Basic ${credentials}`,
                            },
                        }
                    );
                    const codeData = await codeResponse.json();

                    // If the response contains a value, update the formData
                    if (codeData && codeData.value) {
                        setFormData((prevFormData) => ({
                            ...prevFormData,
                            beneficiaryId: codeData.value,
                            code: codeData.value,
                        }));
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }

        };

        // Only trigger the fetchData function if the value is "Indirect"
        if (formData.directIndirect === 'Indirect') {
            fetchData();
        }

    }, [formData.directIndirect]);

    function onAdd() {
        setFormVisible(true);
        setTrigger(prevTrigger => prevTrigger + 1);
    }

    // Function to fetch a new ID from the endpoint
    const fetchNewId = async () => {
        try {
            const response = await fetch(
                // `${process.env.REACT_APP_BASE_URL}/ovc/api/system/id?`,
                `/ovc/api/system/id?`, //with proxy
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${credentials}`,
                    },
                });
            const data = await response.json();
            return data.codes[0];
        } catch (error) {
            console.error('Error fetching new ID:', error);
            return null;
        }
    };


    // Function to handle form submission
    async function handleFormSubmit(event: React.FormEvent) {
        event.preventDefault();
        // console.log("formData", formData)
        setLoading(true);


        // Fetch new ID for the event
        const newId = await fetchNewId();
        if (!newId) {
            console.error('Failed to generate a new event ID!');
            setLoading(false);
            setMessage('Failed to generate a new event ID!');
            return;
        }
        // console.log("id", newId)

        const enteredValues = {
            trackedEntityInstance: props.detailsId,
            orgUnit: orgUnitId,
            program: "IXxHJADVCkb",
            programStage: "aTZwDRoJnxj",
            eventDate: new Date().toISOString(),
            event: newId,

            dataValues: [
                {dataElement: 'ibKkBuv4gX1', value: formData.directIndirect}, //direct
                {dataElement: 'ypDUCAS6juy', value: formData.beneficiaryId}, //Individual Code (Beneficiary ID) code
                {dataElement: 'vfHaBC1ONln', value: formData.name}, //name
                {dataElement: 'ZUKC6mck81A', value: formData.sex},  //sex
                {dataElement: 'eXWM3v3oIKu', value: formData.age},  //age
            ]
        }


        try {
            const response = await fetch(
                // `${process.env.REACT_APP_BASE_URL}/ovc/api/events?`,
                `/ovc/api/events?`, //wth proxy
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${credentials}`,
                    },
                    body: JSON.stringify(enteredValues),
                });

            if (!response.ok) {
                throw new Error('Failed to post data');
            }

            // Hide the form after submission
            // setFormVisible(false);
            setFormData({beneficiaryId: "", name: '', code: '', directIndirect: '', sex: '', age: ''}); // Reset form data
            setMessage('Data successfully saved!');
            setIsError(false);
        } catch (error) {
            console.error('Error posting data:', error);
            setMessage('Error saving data. Please try again.');
            setIsError(true);
        }
        setLoading(false);
    }

    // Function to handle form input changes
    function handleInputChange(event) {
        const {name, value} = event.target;
        setFormData((prevData) => ({...prevData, [name]: value}));
    }

    const handleBeneficiaryIdBlur = async () => {
        const enteredValue = formData.beneficiaryId;
        if (!enteredValue) return;

        try {
            const response = await fetch(
                // `${process.env.REACT_APP_BASE_URL}/ovc/api/trackedEntityInstances/query.json?ouMode=ACCESSIBLE&program=RDEklSXCD4C&attribute=HLKc2AKR9jW:EQ:${enteredValue}&paging=false`,
                `/ovc/api/trackedEntityInstances/query.json?ouMode=ACCESSIBLE&program=RDEklSXCD4C&attribute=HLKc2AKR9jW:EQ:${enteredValue}&paging=false`, //with proxy
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${credentials}`,
                    },
                });
            const data = await response.json();

            console.log("response", data)

            if (data.rows && data.rows.length > 0) {
                const row = data.rows[0]; // Get the first row
                //remove the first zero on the age
                let age = row[9] || ''; // Get the age field
                if (age && age.startsWith('0')) {
                    age = parseInt(age, 10); // Remove leading zero
                }
                setFormData((prev) => ({
                    ...prev,
                    // Set form fields based on row data
                    code: row[8] || '',
                    name: row[11] || '',
                    // directIndirect: "Comprehensive" || 'Indirect', //no field
                    sex: row[12] || '',
                    age: age,
                }));
            }
        } catch (error) {
            console.error('Error getting beneficiary id data:', error);
        }
    };


    return (
        <main className="space-y-4">
            <Header
                onAdd={onAdd}
                onSearch={setSearch}
                search={search}
                back={
                    <Link to={`/${props.orgUnitId}`}>
                        <button className="py-1 px-4 bg-black text-white rounded-md text-sm">
                            Back
                        </button>
                    </Link>
                }
                front={
                    <Link to={`/${props.orgUnitId}/${props.detailsId}/sessions`}>
                        <button className="py-1 px-4 bg-black text-white rounded-md text-sm">
                            Sessions
                        </button>
                    </Link>
                }
            />

            {/*looader for saving entry*/}
            {loading && <div className="mt-4">
                <div className="loader-container">
                    <div className="spinner"></div>
                    <p>Saving Entry...</p>
                </div>
            </div>}

            {message && (
                <div className={isError ? 'error-message' : 'success-message'}>
                    {message}
                </div>
            )}

            {formVisible && (
                <div className="form-container">
                    <form onSubmit={handleFormSubmit} className="form">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Comprehensive/Indirect</label>
                            <select
                                name="directIndirect"
                                value={formData.directIndirect}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                required
                            >
                                <option value="">Select an option</option>
                                <option value="Comprehensive">Comprehensive</option>
                                <option value="Indirect">Indirect</option>
                            </select>
                        </div>
                        {isLoading ? (
                            <div className="mt-4">
                                <div className="loader-container">
                                    <div className="spinner"></div>
                                    <p>Loading code, please wait...</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Beneficiary ID</label>
                                    <input
                                        type="text"
                                        name="beneficiaryId"
                                        value={formData.beneficiaryId}
                                        onChange={handleInputChange}
                                        onBlur={handleBeneficiaryIdBlur}
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Code</label>
                                    <input
                                        type="text"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Sex</label>
                            <input
                                type="text"
                                name="sex"
                                value={formData.sex}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Age</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                required
                            />
                        </div>
                        <div className="button-container">
                            <button type="submit" className="submit-button">
                                Save & Continue
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setFormVisible(false);
                                    setFormData({
                                        beneficiaryId: '',
                                        name: '',
                                        code: '',
                                        directIndirect: '',
                                        sex: '',
                                        age: ''
                                    });
                                }}
                                className="cancel-button"
                            >
                                Close
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Display the table only if the form is not visible */}
            {!formVisible && <Table table={table}/>}
            {!formVisible && <TablePagination table={table}/>}
            {/*<Table table={table} />*/}
            {/*<TablePagination table={table} />*/}
        </main>
    );
}
