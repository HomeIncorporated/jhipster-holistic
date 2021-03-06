import 'package:flutter/cupertino.dart';
import 'package:enterprise/account/settings/settings_bloc.dart';
import 'package:enterprise/generated/l10n.dart';
import 'package:enterprise/routes.dart';
import 'package:enterprise/keys.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:enterprise/shared/bloc/bloc_provider.dart';
import 'package:enterprise/shared/repository/http_utils.dart';
import 'package:enterprise/shared/widgets/drawer/drawer_bloc.dart';
import 'package:enterprise/shared/widgets/drawer/drawer_widget.dart';

class SettingsScreen extends StatelessWidget {
  SettingsScreen() : super(key: EnterpriseKeys.settingsScreen);

  @override
  Widget build(BuildContext context) {
    final settingsBloc = BlocProvider.of<SettingsBloc>(context);
    settingsBloc.getIdentity();
    return Scaffold(
        appBar: AppBar(
          centerTitle: true,
          title: Text(S.of(context).pageSettingsTitle),
        ),
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(15.0),
          child: Column(children: <Widget>[settingsForm(settingsBloc, context)]),
        ),
        drawer: BlocProvider<EnterpriseDrawerBloc>(bloc: EnterpriseDrawerBloc() ,child: EnterpriseDrawer()));
  }

  Widget settingsForm(SettingsBloc settingsBloc, BuildContext context) {
          return Form(
            child: Wrap(runSpacing: 15, children: <Widget>[
              formField<String>(settingsBloc.firstNameStream, settingsBloc.changeFirstname,
                  TextInputType.text,S.of(context).pageSettingsFormFirstname, settingsBloc.firstNameController),
              formField<String>(settingsBloc.lastNameStream, settingsBloc.changeLastname,
                  TextInputType.text,S.of(context).pageSettingsFormLastname, settingsBloc.lastNameController),
              formField<String>(settingsBloc.emailStream, settingsBloc.changeEmail,
                  TextInputType.emailAddress,S.of(context).pageSettingsFormEmail, settingsBloc.emailController),
              languageField(settingsBloc),
              notificationZone(settingsBloc),
              submit(context, settingsBloc)
            ]),
          );
  }

  Widget formField<T>(Stream<T> stream, Function(String) onChange, TextInputType type,
      String labelText, TextEditingController controller) {
    return StreamBuilder<T>(
        stream: stream,
        builder: (context, AsyncSnapshot<T> snapshot) {
            return TextFormField(
                controller:  controller,
                onChanged: onChange,
                keyboardType: type,
                decoration: InputDecoration(
                    labelText: labelText,
                    errorText: snapshot.error));
        }
    );
  }
  Widget languageField(SettingsBloc settingsBloc) {
    return StreamBuilder<Map<String, String>>(
        stream: settingsBloc.languagesStream,
        builder: (context, snapshotLanguages) {
          return StreamBuilder<String>(
            stream: settingsBloc.languageChooseStream,
            builder: (context, snapshot) {
              return Padding(
                padding: const EdgeInsets.only(left: 3.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    Text(S.of(context).pageSettingsFormLanguages, style: Theme.of(context).textTheme.bodyText1,),
                    DropdownButton<String>(
                        value: snapshot.data,
                        onChanged: (key) => settingsBloc.changeLanguage(key),
                        items: snapshotLanguages.hasData ? createDropdownLanguageItems(snapshotLanguages.data) : []),
                  ],
                ),
              );
            }
          );

        });
  }


  List<DropdownMenuItem<String>> createDropdownLanguageItems(Map<String, String> languages) {
    return languages.keys.map<DropdownMenuItem<String>>((String key) =>
            DropdownMenuItem<String>(value: key, child: Text(languages[key])))
        .toList();
  }

  submit(BuildContext context, SettingsBloc settingsBloc){
    return StreamBuilder<bool>(
      stream: settingsBloc.submitValid,
      builder: (context, snapshotSubmit) {
        return RaisedButton(
          child: Container(
              width: MediaQuery.of(context).size.width,
              child: StreamBuilder<bool>(
                  stream: settingsBloc.isLoadingStream,
                  builder: (context, snapshotLoading) {
                    return Center(
                      child: Visibility(
                        replacement: CircularProgressIndicator(value: null),
                        visible: snapshotLoading.hasData && !snapshotLoading.data,
                        child: Text(S.of(context).pageSettingsFormSave.toUpperCase(),
                        ),
                      ),
                    );
                  })),
          onPressed: snapshotSubmit.hasData ?() => saveSettings(snapshotSubmit, settingsBloc, context): null,
        );
      }
    );
  }

  saveSettings(AsyncSnapshot<bool> snapshotSubmit, SettingsBloc settingsBloc, BuildContext context) async {
    var reloadForLanguage = await settingsBloc.submit();
    if(reloadForLanguage) {
      Navigator.popAndPushNamed(context, EnterpriseRoutes.main);
    }
  }

  Widget notificationZone(SettingsBloc settingsBloc) {
    return StreamBuilder<String>(
        stream: settingsBloc.notificationSaveSettings,
        builder: (context, snapshot) {
          return Visibility(
              visible: snapshot.hasData || snapshot.hasError,
              child: Center(
                child: generateNotificationText(snapshot, context),
              ));
        });
  }

    Widget generateNotificationText(AsyncSnapshot<String> snapshot, BuildContext context) {
        String notificationTranslated = '';
        MaterialColor notificationColors;
        if(snapshot.hasData && snapshot.data.compareTo(SettingsBloc.successKey) == 0) {
           notificationTranslated =S.of(context).pageSettingsSuccessSave;
           notificationColors =  Theme.of(context).primaryColor;
        } else if(snapshot.error.toString().compareTo(SettingsBloc.badrequestKey) == 0) {
           notificationTranslated =S.of(context).pageSettingsSuccessErrorBadRequest;
           notificationColors = Theme.of(context).errorColor;
        } else if (snapshot.error.toString().compareTo(HttpUtils.errorServerKey) == 0) {
           notificationTranslated =S.of(context).pageSettingsSuccessErrorServer;
           notificationColors = Theme.of(context).errorColor;
        }

        return Text(
           notificationTranslated,
           style: TextStyle(color: notificationColors),
        );
   }
}
