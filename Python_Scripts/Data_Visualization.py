import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

data = pd.read_csv('data.csv')

sns.pairplot(data, kind="reg")
plt.show()

corr = data.corr()
print(corr)
corr.to_csv('correaltion.csv')
fig, ax = plt.subplots(figsize=(6, 6))
ax.matshow(corr)
plt.title("Correlation Matrix")
plt.xticks(range(len(corr.columns)), corr.columns);
plt.yticks(range(len(corr.columns)), corr.columns);
plt.show()


