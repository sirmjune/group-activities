import {useEffect, useState} from 'react';

import {Header} from '../header';
import {Table, TablePagination} from '../common/table';
import {orgUnitDetailsColumns} from '../../table/org-unit-details';
import {OrgUnitDetails} from '../../types/org-unit-details';
import {useTable} from '../../hooks/use-table';
import {useHistory} from 'react-router-dom';
import React from 'react';
import '../org-unit-about/form-styles.css';

type Props = {
    orgUnitDetails: OrgUnitDetails[];
    orgUnitId: string;
};

export function OrgUnitTable(props: Props) {
    const credentials = btoa(`Skununka:Nomisr123$$$$}`);
    const [search, setSearch] = useState('');
    const history = useHistory();
    const [formVisible, setFormVisible] = useState(false);
    const [trigger, setTrigger] = useState(0); // State to trigger useEffect
    const [userData, setUserData] = useState({
        username: '',
        surname: '',
        firstName: '',
        id: ''
    });
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        groupType: '',
        other: '',
        subGroup: '',
        activity: '',
        activityCode: '',
        description: '',
        dateOfActivity: '',
        venue: ''
    }); // Add initial form data
    // console.log("orgUnitDetails", props.orgUnitDetails);
    const [message, setMessage] = useState(null); // State for success or error message
    const [isError, setIsError] = useState(false); // State to track if the message is an error

    const table = useTable({
        data: props.orgUnitDetails,
        columns: orgUnitDetailsColumns(credentials, setMessage, setIsError),
        globalFilter: search,
        setGlobalFilter: setSearch,
    });



    const [orgUnitCode, setOrgUnitcode] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // First request: Fetch the organization unit code
                const orgUnitCodeResponse = await fetch(
                    `${process.env.REACT_APP_BASE_URL}/ovc/api/organisationUnits/${props.orgUnitId}`,
                    // `/ovc/api/organisationUnits/${props.orgUnitId}`,
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
                setOrgUnitcode(orgUnitCode);

                // Wait for the orgUnitCode to be set before making the second request
                if (orgUnitCode) {
                    // Second request: Fetch the generated code using the organization unit code
                    const codeResponse = await fetch(
                        `${process.env.REACT_APP_BASE_URL}/ovc/api/trackedEntityAttributes/oqabsHE0ZUI/generate?ORG_UNIT_CODE=${orgUnitCode}`,
                        // `/ovc/api/trackedEntityAttributes/oqabsHE0ZUI/generate?ORG_UNIT_CODE=${orgUnitCode}`,
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
                            code: codeData.value,
                        }));
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

    }, [trigger]);

    function onAdd() {
        setFormVisible(true);
        setTrigger(prevTrigger => prevTrigger + 1);
    }

    const [selectedDate, setSelectedDate] = useState('');
    const handleDateChange = (event) => {
        const date = new Date(event.target.value);
        const formattedDate = date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
        setSelectedDate(formattedDate);
    };

    // Function to fetch a new ID
    const fetchNewId = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BASE_URL}/ovc/api/system/id?`,
                // `/ovc/api/system/id?`, //with proxy
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

    // Function to fetch user
    const fetchUser = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BASE_URL}/ovc/api/me`,
                // `/ovc/api/me`, //with proxy
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${credentials}`,
                    },
                });
            const data = await response.json();
            const userData = {
                username: data.username,
                surname: data.surname,
                firstName: data.firstName,
                id: data.id
            };
            setUserData(userData);

            return userData;

        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    };

    async function handleFormSubmit(event: React.FormEvent) {
        event.preventDefault();
        // console.log("formData", formData)

        // Fetch new ID for the event
        const newId = await fetchNewId();
        if (!newId) {
            console.error('Failed to generate a new trackedEntityInstance ID');
            return;
        }
        // console.log("id", newId)

        // Fetch new ID for the event
        const userData = await fetchUser();
        if (!userData) {
            console.error('Failed to get username');
            return;
        }

        const enteredValues = {
            created: new Date().toISOString(),
            orgUnit: props.orgUnitId,
            createdAtClient: new Date().toISOString(),
            trackedEntityInstance: newId,
            lastUpdated: new Date().toISOString(),
            trackedEntityType: "jUBCsJonWQ2",
            lastUpdatedAtClient: new Date().toISOString(),
            storedBy: userData.username,
            potentialDuplicate: false,
            deleted: false,
            inactive: false,
            featureType: "NONE",
            lastUpdatedByUserInfo:
                {
                    uid: userData.id,
                    firstName: userData.firstName,
                    surname: userData.surname,
                    username: userData.username
                },
            createdByUserInfo:
                {
                    uid: userData.id,
                    firstName: userData.firstName,
                    surname: userData.surname,
                    username: userData.username
                },
            programOwners: [],
            relationships: [],

            attributes: [
                {attribute: 'Ah4eyDOBf51', value: formData.name},
                {attribute: 'D7wRx9mgwns', value: formData.venue},
                {attribute: 'Pll79WEVWHj', value: formData.description},
                {attribute: 'VyACOoRKcCA', value: formData.activityCode},
                {attribute: 'b76aEJUPnLy', value: selectedDate},
                {attribute: 'bFnIjGJpf9t', value: formData.groupType},
                {attribute: 'cYDK0qZSri9', value: formData.other},
                {attribute: 'dqbuxC5GB1M', value: formData.activity},
                {attribute: 'mWyp85xIzXR', value: formData.subGroup},
                {attribute: 'oqabsHE0ZUI', value: formData.code}
            ],
            enrollments: [
                {
                    program: 'IXxHJADVCkb',
                    orgUnit: props.orgUnitId,
                    enrollmentDate: new Date().toISOString(),
                    incidentDate: new Date().toISOString()
                }
            ]

        }


        try {
            const response = await fetch(
                `${process.env.REACT_APP_BASE_URL}/ovc/api/trackedEntityInstances?`,
                // `/ovc/api/trackedEntityInstances?`, //wth proxy
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': `Basic ${credentials}`,
                    },
                    body: JSON.stringify(enteredValues),
                });

            if (!response.ok) {
                throw new Error('Failed to post data');
            }

            // Hide the form after submission
            setFormVisible(false);
            setFormData({
                name: '',
                code: '',
                groupType: '',
                other: '',
                subGroup: '',
                activity: '',
                activityCode: '',
                description: '',
                dateOfActivity: '',
                venue: ''
            }); // Reset form data
            setMessage('Data successfully saved!');
            setIsError(false);
        } catch (error) {
            console.error('Error posting data:', error);
            setMessage('Error saving data. Please try again.');
            setIsError(true);
        }

    }

    function handleInputChange(event) {
        const {name, value} = event.target;
        setFormData((prevData) => ({...prevData, [name]: value}));
    }


    return (
        <main className="space-y-4">
            <Header onAdd={onAdd} search={search} onSearch={setSearch}/>

            {message && (
                <div className={isError ? 'error-message' : 'success-message'}>
                    {message}
                </div>
            )}

            {formVisible && (
                <div className="form-container">
                    <form onSubmit={handleFormSubmit} className="form">
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name of CSO/Partner</label>
                            <select
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                required
                            >
                                <option value="">Select an option</option>
                                <option value="ACORD">ACORD</option>
                                <option value="IDI">IDI</option>
                                <option value="UWESO">UWESO</option>
                                <option value="YOUTHALIVE">YOUTHALIVE</option>
                                <option value="TASO">TASO</option>
                                <option value="RHSP">RHSP</option>
                                <option value="MildMay">MildMay</option>
                                <option value="Reach Out Mbuya">Reach Out Mbuya</option>
                                <option value="Masaka Diocesan Medical Services">Masaka Diocesan Medical Services
                                </option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Group Type</label>
                            <select
                                name="groupType"
                                value={formData.groupType}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                required
                            >
                                <option value="">Select an option</option>
                                <option value="1. VSLA Group">VSLA Group</option>
                                <option value="2. Sinovuyo">Sinovuyo</option>
                                <option value="3. Journeys Plus">Journeys Plus</option>
                                <option value="4. NMN">NMN</option>
                                <option value="7. Early Childhood Development(ECD)">Early Childhood Development(ECD)
                                </option>
                                <option value="5. Stepping Stones">Stepping Stones</option>
                                <option value="6. Other(Specify)">Other(Specify)</option>
                            </select>

                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name / other</label>
                            <input
                                type="text"
                                name="other"
                                value={formData.other}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Sub Group</label>
                            <input
                                type="text"
                                name="subGroup"
                                value={formData.subGroup}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Activity</label>
                            <input
                                type="text"
                                name="activity"
                                value={formData.activity}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Activity Code</label>
                            <input
                                type="text"
                                name="activityCode"
                                value={formData.activityCode}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date of Activity</label>
                            <input
                                type="date"
                                name="dateOfActivity"
                                value={selectedDate}
                                onChange={handleDateChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Venue</label>
                            <input
                                type="text"
                                name="venue"
                                value={formData.venue}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                required
                            />
                        </div>
                        <div className="button-container">
                            <button type="submit" className="submit-button">
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setFormVisible(false);
                                    setFormData({
                                        groupType: "", other: "", subGroup: "", venue: "",
                                        activityCode: '',
                                        name: '',
                                        code: '',
                                        activity: '',
                                        description: '',
                                        dateOfActivity: ''
                                    });
                                    setSelectedDate('');
                                }}
                                className="cancel-button"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}


            {!formVisible && <Table
                table={table}
                onRowClick={(row) => {
                    const id = row.getValue('id');
                    history.push(`/${props.orgUnitId}/${id}/about`);
                }}
            />}
            {!formVisible && <TablePagination table={table}/>}
        </main>
    );
}
