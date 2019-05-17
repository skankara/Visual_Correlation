import csv
import pandas as pd

child = pd.read_csv("D:/DV_Project/Side-side/data/child_mortality_0_5_year_olds_dying_per_1000_born.csv")
child = child[['country', '2014']]
child.rename(columns={'2014':'child_mortality'}, inplace=True)
#child.to_csv("D:/DV_Project/child_mortality.csv",index = "False")

fertility = pd.read_csv("D:/DV_Project/Side-side/data/children_per_woman_total_fertility.csv")
fertility = fertility[['country','2014']]
fertility.rename(columns={'2014':'fertility'}, inplace=True)
#fertility.to_csv("D:/DV_Project/fertility.csv", index = "False")

data = child.merge(fertility, 'left', on='country')

co2 = pd.read_csv("D:/DV_Project/Side-side/data/co2_emissions_tonnes_per_person.csv")
co2 = co2[['country','2014']]
co2.rename(columns={'2014':'co2_emmission'}, inplace=True)
data = data.merge(co2, 'left', on='country')

energy_use = pd.read_csv("D:/DV_Project/Side-side/data/energy_use_per_person.csv")
energy_use = energy_use[['country','2014']]
energy_use.rename(columns={'2014':'energy_use'}, inplace=True)
data = data.merge(energy_use, 'left', on='country')

income = pd.read_csv("D:/DV_Project/Side-side/data/income_per_person_gdppercapita_ppp_inflation_adjusted.csv")
income = income[['country','2014']]
income.rename(columns={'2014':'income'}, inplace=True)
data = data.merge(income, 'left', on='country')

population_density = pd.read_csv("D:/DV_Project/Side-side/data/population_density_per_square_km.csv")
population_density = population_density[['country','2014']]
population_density.rename(columns={'2014':'population_density'}, inplace=True)
data = data.merge(population_density, 'left', on='country')



data.to_csv("D:/DV_Project/data.csv", index = False)

