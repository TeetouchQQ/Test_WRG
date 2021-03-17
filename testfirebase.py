from firebase import firebase

firebase = firebase.FirebaseApplication('https://wrgcheckout-46e22-default-rtdb.firebaseio.com/', None)
item1 = {'id':1,'name':'test1,test2'}
#item2 = {'id':2,'name':'test2'}

result1 = firebase.get('/list','item')
#result2 = firebase.put('/list','item',item2)

#print(result1[:-1])
#print(result2)
