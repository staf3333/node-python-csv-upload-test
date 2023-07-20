import os
from pathlib import Path
import pandas as pd

# Set directory, in prod this will be passed in as an argument to the child process
data_directory = "uploads/Strung V1 Stiff"

cycles = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5]
cycle1 = [0, 0.5]
cycle2 = [1, 1.5]
cycle5 = [4, 4.5]

sample_folders = []
samples = {}

# find all folders with a tracking file in data folder
for fn in Path(data_directory).rglob('*.csv'):
    sample_folders.append(os.path.dirname(fn.as_posix()))

# Step through each folder and figure build library to store data
for data_folder in sample_folders:
    for filename in Path(data_folder).rglob('*.csv'):
        sample_id = data_folder.split('/')[-1].split('.')[0]
        filename = Path(filename)
        # Create library entry for each sample
        samples[sample_id] = {}
        samples[sample_id]['filename'] = filename.as_posix()

"""
Tracking Processing
"""

# Function to pull data from tracking files


def extractTrackingData(df):
    # Fill temp dataframe
    td = pd.DataFrame({
        'Cycle': df['Total cycle count'],
        'TotalTime': df['Time'],
        'Displacement(mm)': df['Extension'],
        'Force(N)': df['Load']
    })
    return td


# Loop through files and fill df
for sample_id in samples.keys():
    samples[sample_id]['Compression_df'] = extractTrackingData(
        pd.read_csv(samples[sample_id]['filename'], skiprows=[1]))

for test_key in samples:
    temp_df = samples[test_key]['Compression_df']
    init_disp = temp_df['Displacement(mm)'].iloc[0]
    temp_df['Zeroed Displacement(mm)'] = (
        temp_df['Displacement(mm)']) - init_disp

# print(samples)

# INSERT DESIRED FIELDS FOR EXPORT HERE
fields_to_pull = ['Cycle', 'Displacement(mm)', 'Force(N)']

"""
Create CSV Export If You Want
"""


def export_csv():
    # Create file name and file for export
    extension = 'DATA_MASTER.xlsx'
    timestr = time.strftime("%Y%m%d-")
    export_file_name = data_directory + '/' + timestr + extension

    workbook = xlsxwriter.Workbook(export_file_name)
    worksheet1 = workbook.add_worksheet('All Data')
    worksheet2 = workbook.add_worksheet('1st Cycle')
    worksheet3 = workbook.add_worksheet('2nd Cycle')
    worksheet4 = workbook.add_worksheet('5th Cycle')

    worksheet_variables = [worksheet1, worksheet2, worksheet3, worksheet4]
    cycle_variables = [cycles, cycle1, cycle2, cycle5]

    # INSERT DESIRED FIELDS FOR EXPORT HERE
    column_step = len(fields_to_pull) + 1

    # All Data
    # Per Worksheet
    for i, worksheet_number in enumerate(worksheet_variables):

        # Per Test (K060)
        for test_idx, test_key in enumerate(samples):
            # pulls compression data for specific file
            temp_df = samples[test_key]['Compression_df']

            # Culls data for the appropriate cycles
            temp_df = temp_df[temp_df['Cycle'].isin(cycle_variables[i])]
            left = test_idx * column_step
            worksheet_number.write(0, left, test_key)

            # Per Field (Displacement)
            for field_idx, field in enumerate(fields_to_pull):
                column_idx = left + field_idx
                worksheet_number.write(1, column_idx, field)

                # Per data line (-30)
                for row_num, data in enumerate(temp_df[field]):
                    worksheet_number.write(row_num+2, column_idx, data)

    workbook.close()


stiffness_results = []
names = []
n = 0

encode_data = []

for test_idx, test_key in enumerate(samples.keys()):

    #     temp_df = temp_df[temp_df['Cycle'].isin(cycle_variables[i])]
    temp_df = samples[test_key]['Compression_df']

    temp0_df = temp_df[temp_df['Cycle'].isin(cycles)]

    temp1_df = temp_df[temp_df['Cycle'].isin(cycle1)]

    temp2_df = temp_df[temp_df['Cycle'].isin(cycle2)]

    temp5_df = temp_df[temp_df['Cycle'].isin(cycle5)]

    # calculate stiffness and plot
    n = n+1
    Extension = []
    Load = []
    name = str(test_key)
    # can adjust name range to capture unique file name part and not file path C:/ etc...
    # name=name[14:]
    names.append(name)

    field1 = fields_to_pull[1]
    field2 = fields_to_pull[2]

    # **adjust which sheet/cycle to calculate & plot from with temp1_df (first cycle),temp2_df (seccond cycle), temp4_df (5th cycle)**
    for row_num, data in enumerate(temp5_df[field1]):
        Extension.append(data)
    for row_num, data in enumerate(temp5_df[field2]):
        Load.append(data)

    # calculate stiffness
    maxex = max(Extension)
    stiffness_list = []
    stiffness_range_extension = []
    # **adjust which region you are calculating stiffness from ex: 1<=Extension[i]<=1.5**
    for i in range(0, Extension.index(maxex)):
        if 1.5 <= Extension[i] <= 2.5:
            stiffness_range_extension.append(i)
    x2 = Extension[stiffness_range_extension[-1]]
    x1 = Extension[stiffness_range_extension[0]]
    y2 = Load[stiffness_range_extension[-1]]
    y1 = Load[stiffness_range_extension[0]]

    stiffness = ((y2-y1)/(x2-x1))

    # print(names[n-1])
    # print(stiffness)

    encode_data.append((names[n - 1], stiffness))

print(encode_data)
