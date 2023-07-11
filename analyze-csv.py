import sys
import pandas as pd
import json

# file_path = sys.argv[1]
file_path = 'uploads/1689041725975--Specimen_RawData_1.csv'
# read csv file using pandas
data = pd.read_csv(file_path, skiprows=[1])


def extractTrackingData(df):
    # Fill temp dataframe
    td = pd.DataFrame({
        'Cycle': df['Total cycle count'],
        'TotalTime': df['Time'],
        'Displacement(mm)': df['Extension'],
        'Force(N)': df['Load']
    })
    return td


new_data = extractTrackingData(data)

init_disp = new_data['Displacement(mm)'].iloc[0]
new_data['Zeroed Displacement(mm)'] = (
    new_data['Displacement(mm)']) - init_disp

# print(new_data)

Extension = []
Load = []

# extract displacement
for row_num, data in enumerate(new_data['Displacement(mm)']):
    Extension.append(data)
# extract load
for row_num, data in enumerate(new_data['Force(N)']):
    Load.append(data)


encode_data = {}
encode_data['x'] = Extension
encode_data['y'] = Load
json_data = json.dumps(encode_data)
print(json_data)
