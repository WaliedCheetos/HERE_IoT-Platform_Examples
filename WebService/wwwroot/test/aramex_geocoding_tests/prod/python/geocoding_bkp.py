import pandas as pd
import requests
import time

apikey = 'pmYeJOpIGhJHSyyizwSKKPJoAHdjJ_bj12yfckgiT4E'
customerSampleCity = 'Dubai'
customerSampleCountry = 'ARE'


datasheet = pd.read_excel(
    '/Library/WebServer/Documents/WaliedCheetos/HERE_IoT-Platform_Examples/WebService/wwwroot/test/aramex_geocoding_tests/prod/data/samples/100k_final_addresses_Dubai.xlsx', 
    sheet_name=0
    )

dataList = []
dataFrame = pd.DataFrame()    

for index, row in datasheet[0:7].iterrows():
    # each row is returned as a panda series
    shipmentID = row['ShipmentID']
    addressText = row["Address"]


 #region first iteration: search for the address text via GS7 one-box

    oneboxSearch_req = f'https://search.hereapi.com/v1/geocode?q={addressText}&qq=country={customerSampleCountry};city={customerSampleCity}&lang=en-US&limit=5&apikey={apikey}'
    # print(oneboxSearch_req)

    # sending get request and saving the response as response object
    req = requests.get(url=oneboxSearch_req)

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
            queryScore = data['items'][0]['scoring']['queryScore']
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



dataFrame.to_excel('/Library/WebServer/Documents/WaliedCheetos/HERE_IoT-Platform_Examples/WebService/wwwroot/test/aramex_geocoding_tests/prod/data/samples/results.xlsx',
 sheet_name=time.strftime("%Y_%m_%d %H_%M_%S"))

#endregion
    
    


#region second iteration: search for the address text via auto suggest then use the very first result in the response to search via GS7 oe-box

    oneboxSearch_req = f'https://search.hereapi.com/v1/geocode?q={addressText}&qq=country={customerSampleCountry};city={customerSampleCity}&lang=en-US&limit=5&apikey={apikey}'
    # print(oneboxSearch_req)

    # sending get request and saving the response as response object
    req = requests.get(url=oneboxSearch_req)

    # extracting data in json format
    data = req.json()

#endregion
