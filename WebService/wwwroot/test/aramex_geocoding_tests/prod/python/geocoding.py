import pandas as pd
import requests
import time

apikey = 'pmYeJOpIGhJHSyyizwSKKPJoAHdjJ_bj12yfckgiT4E'
# customerSampleCity = 'Dubai'
# customerSampleCountry = 'ARE'
# customerSampleCenter = '25.26951,55.30884'
customerSampleCity = 'Riyadh'
customerSampleCountry = 'SAU'
customerSampleCenter = '24.68204,46.68725'


# addressText = 'Unit # 1905, 19th Floor, Tameem House Building, Al Thanya First, Dubai, UAE. Dubai'

# oneboxSearch_req = f'https://search.hereapi.com/v1/discover?q={requests.utils.quote(addressText)}&limit=1&at={customerSampleCenter}&apikey={apikey}'

# req = requests.get(url=oneboxSearch_req)

# # extracting data in json format
# data = req.json()

# print(data)

datasheet = pd.read_excel(
    '/Users/ahmadmoh/Desktop/RiyadhResults_Unicoded.xlsx', 
    sheet_name=0
    )

dataList = []
dataFrame = pd.DataFrame()    

# for index, row in datasheet[0:3].iterrows():
for index, row in datasheet[0:501].iterrows():
    print(f'WaliedCheetos : I am looping @ {index}')
    # each row is returned as a panda series
    shipmentID = row['ShipmentID']
    addressText = row["Address"]





 #region first iteration: search for the address text via GS7 one-box

    ##gs7Geocoding_req = f'https://search.hereapi.com/v1/geocode?q={addressText}&qq=country={customerSampleCountry};city={customerSampleCity}&lang=en-US&limit=5&apikey={apikey}'
    ##oneboxSearch_req = f'https://search.hereapi.com/v1/discover?q={requests.utils.quote(addressText)}&limit=1&at={customerSampleCenter}&apikey={apikey}'

    req_URL = f'https://search.hereapi.com/v1/discover?q={requests.utils.quote(addressText)}&limit=1&at={customerSampleCenter}&apikey={apikey}'

    # print(oneboxSearch_req)

    # sending get request and saving the response as response object
    req = requests.get(url=req_URL)

    # extracting data in json format
    data = req.json()

    ##title = ''
    addressLabel = ''
    resultType = ''
    queryScore = ''
    lat = ''
    lng = ''
    remarks = ''

    if( 'items' in data):
        if(len(data['items']) == 0):
            ##title = ''
            addressLabel = ''
            resultType = ''
            queryScore = ''
            lat = ''
            lng = ''
            remarks = 'NO GEOCODE'
        else:
            ##title = data['items'][0]['title']
            addressLabel = data['items'][0]['address']['label']
            resultType = data['items'][0]['resultType']
            queryScore = ''
            # queryScore = data['items'][0]['scoring']['queryScore']
            lat = data['items'][0]['position']['lat']
            lng = data['items'][0]['position']['lng']
            remarks = ''
    elif('error' in data):
        ##title = ''
        addressLabel = ''
        resultType = ''
        queryScore = ''
        lat = ''
        lng = ''
        remarks = data['error'] + ' - ' + data['error_description']

    ##dataList.append((shipmentID, addressText, title, resultType, queryScore, addressLabel, lat, lng, remarks))
    dataList.append((shipmentID, addressText, addressLabel, resultType, queryScore, lat, lng, remarks))

##dataFrame = pd.DataFrame(dataList, columns=['shipment_id', 'original_address_text', 'geocoded_address_title', 'geocoded_address_resultType', 'geocoded_address_queryScore', 'geocoded_address_addressLabel', 'geocoded_address_lat', 'geocoded_address_lng', 'remarks'])
dataFrame = pd.DataFrame(dataList, columns=['shipment_id', 'original_address_text', 'geocoded_address_addressLabel', 'geocoded_address_resultType', 'geocoded_address_queryScore', 'geocoded_address_lat', 'geocoded_address_lng', 'remarks'])
##print(dataFrame)



dataFrame.to_excel(f'/Users/ahmadmoh/Desktop/RiyadhResults_'+time.strftime("%Y_%m_%d %H_%M_%S")+'_Unicoded.xlsx',
 sheet_name='WaliedCheetos')

#endregion
    
    


#region second iteration: search for the address text via auto suggest then use the very first result in the response to search via GS7 oe-box

#endregion
